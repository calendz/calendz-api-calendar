'use strict'

const moment = require('moment')
const Scrapper = use('Scrapper')
const DateUtils = use('DateUtils')
const ScrappingException = use('App/Exceptions/ScrappingException')
const InvalidDateException = use('App/Exceptions/InvalidDateException')

class DayController {
  /**
   * Get courses of current day
   */
  async getCurrent ({ request }) {
    const payload = request.only(['firstname', 'lastname'])

    // get current date and format with moment
    const date = moment(new Date()).format('MM/DD/YY')

    const result = await Scrapper.fetchDay(payload.firstname, payload.lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    return result
  }

  /**
   * Get courses of a given day
   */
  async getByDate ({ request, params }) {
    const payload = request.only(['firstname', 'lastname'])

    // check if date is valid
    if (!DateUtils.isValid(params.date)) throw new InvalidDateException()
    const formattedDate = moment(params.date, 'MM-DD-YYYY').format('MM/DD/YY')

    const result = await Scrapper.fetchDay(payload.firstname, payload.lastname, formattedDate)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException()
      })

    return result
  }
}

module.exports = DayController
