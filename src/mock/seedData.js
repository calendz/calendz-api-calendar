/* istanbul ignore file */
const faker = require('faker')
faker.locale = 'fr'

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
  } catch (err) {
    logger.error(err)
  }
}
