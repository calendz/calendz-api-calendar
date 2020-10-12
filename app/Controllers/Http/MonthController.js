'use strict'

const moment = require('moment')
const Cache = use('Cache')
const Scrapper = use('Scrapper')
const ScrappingException = use('App/Exceptions/ScrappingException')

const numberOfWeekByMonth = 4

class MonthController {
  /**
   * Get courses of the current month
   */
  async getCurrent ({ request }) {
    const { firstname, lastname, ignoreCache } = request.only(['firstname', 'lastname', 'ignoreCache'])

    const result = []

    for (let i = 0; i < numberOfWeekByMonth; i++) {
      let cacheUsed = false
      // get current date (+ i * 7 days) and format with moment
      const date = moment(new Date()).add(i * 7, 'd').format('MM/DD/YY')

      // ---------------------------------------------------
      // Use cache (or at least, try to)

      if (!ignoreCache) {
      // Get data from cache
        const data = await Cache.getWeek(firstname, lastname, date)
        if (data) {
          cacheUsed = true
          result.push(data)
        }
      }

      // ---------------------------------------------------
      // Data not in cache: scrapping

      if (ignoreCache || !cacheUsed) {
        // if not cached, scrap it
        const data = await Scrapper.fetchWeek(firstname, lastname, date)
          .catch(() => { /* istanbul ignore next */ throw new ScrappingException() })

        result.push(data)

        // set scrap result in cache
        await Cache.setWeek(firstname, lastname, date, data)
        // indicate to not restart scrapping today
        await Cache.setIsDailyScrapped(firstname, lastname, date)
      }
    }

    return result
  }
}

module.exports = MonthController
