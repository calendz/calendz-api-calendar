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
  },
  scrapping: {
    doc: 'Whether scrapping should be enabled or not',
    format: Boolean,
    default: false,
    arg: 'scrapping',
    env: 'SCRAPPING'
  },
  populate: {
    doc: 'Should populate DB w/ fake dataset?',
    format: Boolean,
    default: false,
    arg: 'populate',
    env: 'POPULATE'
  },
  db: {
    host: {
      doc: 'The MongoDB hostname',
      format: String,
      default: '127.0.0.1',
      arg: 'db_host',
      env: 'DB_HOST'
    },
    port: {
      doc: 'The MongoDB port',
      format: Number,
      default: '27017',
      arg: 'db_port',
      env: 'DB_PORT'
    },
    name: {
      doc: 'The MongoDB database name',
      format: String,
      default: 'calendz',
      arg: 'db_name',
      env: 'DB_NAME'
    },
    user: {
      doc: 'The MongoDB user',
      format: String,
      default: 'username',
      arg: 'db_user',
      env: 'DB_USER'
    },
    password: {
      doc: `The MongoDB user's password`,
      format: String,
      default: 'password',
      arg: 'db_password',
      env: 'DB_PASSWORD'
    }
  }
})

config.validate({ allowed: 'strict' })
module.exports = config.getProperties()
