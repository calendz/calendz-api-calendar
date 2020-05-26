'use strict'

const moment = require('moment')
const Redis = use('Redis')
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

    // try to retrieve the value from cache
    const cachedResult = await Redis.hget(`u:${firstname}.${lastname}`, [`d:${date}`])
    if (cachedResult) return JSON.parse(cachedResult)

    // if not cached, scrap it
    const result = await Scrapper.fetchDay(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    const expireIn = DateUtils.computeExpireMidnight()
    await Redis.hmset(`u:${firstname}.${lastname}`, `d:${date}`, JSON.stringify(result))
    await Redis.expire(`u:${firstname}.${lastname}`, expireIn)

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

    // try to retrieve the value from cache
    const cachedResult = await Redis.hget(`u:${firstname}.${lastname}`, [`d:${date}`])
    if (cachedResult) return JSON.parse(cachedResult)

    // if not cached, scrap it
    const result = await Scrapper.fetchDay(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    const expireIn = DateUtils.computeExpireMidnight()
    await Redis.hmset(`u:${firstname}.${lastname}`, `d:${date}`, JSON.stringify(result))
    await Redis.expire(`u:${firstname}.${lastname}`, expireIn)

    return result
  }
}

module.exports = DayController
