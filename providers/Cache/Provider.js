'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CacheProvider extends ServiceProvider {
  register () {
    this.app.singleton('Cache', () => {
      return new (require('.'))()
    })
  }
}

module.exports = CacheProvider
