'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ScrappingProvider extends ServiceProvider {
  register () {
    this.app.singleton('Scrapper', () => {
      return new (require('.'))()
    })
  }
}

module.exports = ScrappingProvider
