const redis = require('redis')
const bluebird = require('bluebird')
const config = require('./config')
const logger = require('./winston')

// Promisify all redis library since it doesn't support async/await
bluebird.promisifyAll(redis)

const client = redis.createClient(config.redis.port, config.redis.host)

client.auth(config.redis.password)

// ============================================
// == configure error handler
// ============================================

client.on('error', (err) => {
  logger.error('Redis error :')
  logger.error(err)
})

module.exports = client
