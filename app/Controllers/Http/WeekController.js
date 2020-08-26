'use strict'

const moment = require('moment')
const Cache = use('Cache')
const Scrapper = use('Scrapper')
const DateUtils = use('DateUtils')
const ScrappingException = use('App/Exceptions/ScrappingException')
const InvalidDateException = use('App/Exceptions/InvalidDateException')

class WeekController {
  /**
   * Get courses of the current week
   */
  async getCurrent ({ request }) {
    const { firstname, lastname, ignoreCache } = request.only(['firstname', 'lastname', 'ignoreCache'])

    // get current date and format with moment
    const date = moment(new Date()).format('MM/DD/YYYY')

    // try to retrieve and return data from cache/redis
    if (!ignoreCache) {
      const data = await Cache.getWeek(firstname, lastname, date)
      if (data) return data
    }

    // if not cached, scrap it
    const result = await Scrapper.fetchWeek(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    // set scrap result in cache
    await Cache.setWeek(firstname, lastname, date, result)

    return result
  }

  /**
   * Get courses of a given week
   */
  async getByDate ({ request, params }) {
    const { firstname, lastname, ignoreCache } = request.only(['firstname', 'lastname', 'ignoreCache'])

    // check if date is valid, if yes format it
    if (!DateUtils.isValid(params.date)) throw new InvalidDateException()
    const date = moment(params.date, 'MM-DD-YYYY').format('MM/DD/YY')

    // try to retrieve and return data from cache/redis
    if (!ignoreCache) {
      const data = await Cache.getWeek(firstname, lastname, date)
      if (data) return data
    }

    // if not cached, scrap it
    const result = await Scrapper.fetchWeek(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    // set scrap result in cache
    await Cache.setWeek(firstname, lastname, date, result)

    return result
  }
}

module.exports = WeekController
