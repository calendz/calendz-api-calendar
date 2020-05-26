'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const code = 'E_INVALID_DATE'
const status = 412
const message = 'Date is invalid. Please use DD/MM/YY format.'

class InvalidDateException extends LogicalException {
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

module.exports = InvalidDateException
