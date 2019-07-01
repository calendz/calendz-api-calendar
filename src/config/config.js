const convict = require('convict')
require('dotenv').config()

const config = convict({
  node_env: {
    doc: 'The application runtime environment',
    format: ['development', 'production', 'test'],
    default: 'development',
    arg: 'node_env',
    env: 'NODE_ENV'
  },
  app_port: {
    doc: 'The API port',
    format: Number,
    default: 3000,
    arg: 'app_port',
    env: 'APP_PORT'
  }
})

config.validate({ allowed: 'strict' })
module.exports = config.getProperties()
