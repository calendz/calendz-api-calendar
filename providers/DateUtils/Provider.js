'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class DateUtilsProvider extends ServiceProvider {
  register () {
    this.app.singleton('DateUtils', () => {
      return new (require('.'))()
    })
  }
}

module.exports = DateUtilsProvider
