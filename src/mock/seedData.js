const faker = require('faker')
faker.locale = 'fr'

const logger = require('../config/winston')

const ProfessorModel = require('../models/professor.model')
const CourseModel = require('../models/course.model')

const Professor = require('../mock/factories/professor.factory')
const Course = require('../mock/factories/course.factory')

// ===================================
// == start by removing all data
// ===================================
module.exports.removeAllData = async function removeAllData () {
  try {
    await ProfessorModel.deleteMany({})
    await CourseModel.deleteMany({})

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
    await ProfessorModel.insertMany(generateProfessors(50)).then(() => {
      logger.info(`=> inserted 50 random generated professors`)
    })
    await CourseModel.insertMany(generateCourses(50)).then(() => {
      logger.info(`=> inserted 50 random generated courses`)
    })
  } catch (err) {
    logger.error(err)
  }
}

function generateCourses (amount) {
  const array = []
  for (let i = 0; i < amount; i++) {
    array.push(new Course({}))
  }
  return array
}

function generateProfessors (amount) {
  const array = []
  for (let i = 0; i < amount; i++) {
    array.push(new Professor({}))
  }
  return array
}
