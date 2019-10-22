const redis = require('redis')
const config = require('./config')
const logger = require('./winston')

const client = redis.createClient(config.redis.port, config.redis.host)

// ============================================
// == configure error handler
// ============================================

client.on('error', (err) => {
  logger.error('Redis error :')
  logger.error(err)
})

module.exports = client
