const logger = require('../config/winston')

// ===================================
// == start by removing all data
// ===================================
module.exports.removeAllData = async function removeAllData () {
  try {
    logger.info('=> Successfully removed all existent data')
  } catch (err) {
    logger.error(err)
  }
}

// ===================================
// == add data
// ===================================
module.exports.seedData = async function seedData () {
  try {
    logger.info('=> Successfully saved NOTHING!')
  } catch (err) {
    logger.error(err)
  }
}