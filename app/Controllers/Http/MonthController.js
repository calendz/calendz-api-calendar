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
      // get current date and format with moment
      const date = moment(new Date()).add(i, 'M').format('MM/DD/YYYY')

      // try to retrieve and return data from cache/redis
      if (!ignoreCache) {
        const data = await Cache.getWeek(firstname, lastname, date)
        if (data) {
          result.push(data)
        } else {
          // if not cached, scrap it
          const data = await Scrapper.fetchWeek(firstname, lastname, date)
            .catch(() => {
            /* istanbul ignore next */
              throw new ScrappingException()
            })

          result.push(data)

          // set scrap result in cache
          await Cache.setWeek(firstname, lastname, date, data)
        }
      }
    }

    return result
  }
}

module.exports = MonthController
