'use strict'

const { formatters } = use('Validator')

class RequireName {
  get formatter () {
    return formatters.JsonApi
  }

  get validateAll () {
    return true
  }

  get rules () {
    return {
      firstname: 'string|required',
      lastname: 'string|required'
    }
  }

  get messages () {
    return {
      'firstname.string': 'Firstname must be a string.',
      'firstname.required': 'You must provide a firstname.',
      'lastname.string': 'Lastname must be a string.',
      'lastname.required': 'You must provide a lastname.'
    }
  }
}

module.exports = RequireName
