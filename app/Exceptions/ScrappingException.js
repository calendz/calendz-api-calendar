'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const code = 'E_SCRAPPING_ERROR'
const status = 500
const message = 'Scrapping failed... This is likely due to the official website having a problem. Please try again.'

/* istanbul ignore next */
class ScrappingException extends LogicalException {
  constructor () {
    super(message, status, code)
  }

  handle (_, { response }) {
    return response.status(status).send({
      errors: [{
        status: status,
        code: code,
        detail: message
      }]
    })
  }
}

module.exports = ScrappingException
