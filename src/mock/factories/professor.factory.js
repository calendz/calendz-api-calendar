const faker = require('faker')
const mongoose = require('mongoose')

module.exports = class Professor {
  constructor ({
    firstname = faker.name.firstName(),
    lastname = faker.name.lastName(),
    courses = generateCourses(20)
  }) {
    this.firstname = firstname
    this.lastname = lastname
    this.courses = courses
  }
}

function generateCourses (amount) {
  const array = []
  for (let i = 0; i < amount; i++) {
    array.push(mongoose.Types.ObjectId())
  }
  return array
}
