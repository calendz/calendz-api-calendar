const logger = require('./config/winston')
const config = require('./config/config')
const app = require('./config/express')

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  /* istanbul ignore next */
  // start the web server
  app.listen(config.app_port, () => {
    logger.info('Loaded express.')
    logger.info(`App started in ${config.node_env.toUpperCase()} mode.`)
    logger.info(`Server started on http://localhost:${config.app_port}.`)
  })
}

module.exports = app
