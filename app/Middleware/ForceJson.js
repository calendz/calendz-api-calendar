'use strict'

class ForceJson {
  async handle ({ request }, next) {
    request.request.headers.accept = 'application/json'
    await next()
  }
}

module.exports = ForceJson
