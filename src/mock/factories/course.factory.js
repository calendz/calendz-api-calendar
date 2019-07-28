const faker = require('faker')
const mongoose = require('mongoose')

module.exports = class Course {
  constructor ({
    subject = faker.random.word(),
    grade = faker.random.arrayElement(['B1 G1', 'B1 G2', 'B2 G1', 'B2 G2', 'B3 G1', 'B3 G2', 'B3 G3', 'I4 G1', 'I4 G2', 'I5 G1', 'I5 G2']),
    bts = faker.random.boolean(),
    professor = mongoose.Types.ObjectId(),
    courses = generateCourses(Math.floor(Math.random() * 15) + 2)
  }) {
    this.subject = subject
    this.grade = grade
    this.bts = bts
    this.professor = professor
    this.courses = courses
  }
}

function generateCourses (amount) {
  const array = []
  for (let i = 0; i < amount; i++) {
    const time = Math.floor(Math.random() * 12) + 8
    array.push({
      date: faker.date.future(1),
      weekday: faker.random.arrayElement(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']),
      start: time.toString() + ':00',
      end: (time + 2).toString() + ':00',
      room: faker.random.alphaNumeric(4)
    })
  }
  return array
}
