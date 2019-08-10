const logger = require('./config/winston')
const config = require('./config/config')
const app = require('./config/express')
const initMongo = require('./config/mongoose')
const seedData = require('./mock/seedData')
const cronScrap = require('./cron-jobs/scrap')

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {

// 1st: establish mongodb connection
initMongo(async () => {
  /* istanbul ignore if */
  // 2nd: if needed: populate db w/ fake dataset
  if (config.populate && config.node_env !== 'test') {
    logger.info('===== Started dataset =====')
    await seedData.removeAllData().then(async () => {
      await seedData.seedData().then(() => {
        logger.info('===== Dataset completed =====')
      })
    })
  }

  // 3rd: start the web server
  const port = config.node_env === 'test' ? config.app_port_test : config.app_port
  app.listen(port, () => {
    logger.info('Loaded express.')
    logger.info(`App started in ${config.node_env.toUpperCase()} mode.`)
    logger.info(`Server started on http://localhost:${port}.`)
  })

  if (config.scrapping) {
    cronScrap.initScrap()
  }
})
// }

module.exports = app
