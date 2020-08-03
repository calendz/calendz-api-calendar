'use strict'

const moment = require('moment')
const Cache = use('Cache')
const Scrapper = use('Scrapper')
const DateUtils = use('DateUtils')
const ScrappingException = use('App/Exceptions/ScrappingException')
const InvalidDateException = use('App/Exceptions/InvalidDateException')

class DayController {
  /**
   * Get courses of current day
   */
  async getCurrent ({ request }) {
    const { firstname, lastname } = request.only(['firstname', 'lastname'])

    // get current date and format with moment
    const date = moment(new Date()).format('MM/DD/YY')

    // try to retrieve and return data from cache/redis
    const data = await Cache.getDay(firstname, lastname, date)
    if (data) return data

    // if not cached, scrap it
    const result = await Scrapper.fetchDay(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    // set scrap result in cache
    await Cache.setDay(firstname, lastname, date, result)

    return result
  }

  /**
   * Get courses of a given day
   */
  async getByDate ({ request, params }) {
    const { firstname, lastname } = request.only(['firstname', 'lastname'])

    // check if date is valid, if yes format it
    if (!DateUtils.isValid(params.date)) throw new InvalidDateException()
    const date = moment(params.date, 'MM-DD-YYYY').format('MM/DD/YY')

    // try to retrieve and return data from cache/redis
    const data = await Cache.getDay(firstname, lastname, date)
    if (data) return data

    // if not cached, scrap it
    const result = await Scrapper.fetchDay(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    // set scrap result in cache
    await Cache.setDay(firstname, lastname, date, result)

    return result
  }
}

module.exports = DayController
