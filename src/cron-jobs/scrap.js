/* istanbul ignore file */
const cron = require('node-cron')
const moment = require('moment')
const request = require('request-promise')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const UserModel = require('../models/user.model')
const dateTranslator = require('../utils/dateTranslator')
const ProfessorModel = require('../models/professor.model')
const CourseModel = require('../models/course.model')
const mongoose = require('mongoose')

module.exports.initScrap = async () => {
  try {
    // List of all professors and courses from the scrap
    let itemsList

    // List of professors and list of courses that will
    // contain all professors and courses objects
    let professorsList = []
    let coursesList = []

    // Get the result from the scrap
    await findUsers().then((result) => {
      console.log(result)
      itemsList = result
    })

    // Create professor object for each element in the list
    // and push them in the professors list
    itemsList['professors'].forEach(function (element) {
      let name = element.split(' ')
      let firstName = name[name.length - 1]
      name.splice(name.length - 1, 1)
      let lastName = name.join(' ')
      console.log(firstName + ' - ' + lastName)
      if (firstName.length >= 2 && lastName.length >= 2) {
        professorsList.push(new ProfessorModel({
          _id: mongoose.Types.ObjectId(),
          firstname: firstName,
          lastname: lastName
        }))
      }
    })

    // Create course object for each element in the list
    // and push them in the courses list
    itemsList['courses'].forEach(function (element) {
      let name = element.professor.split(' ')
      let firstname = name[name.length - 1]
      name.splice(name.length - 1, 1)
      let lastname = name.join(' ')
      let professorId = 0

      // Search the id of the matching professor
      professorsList.forEach(function (el) {
        if (el.firstname === firstname && el.lastname === lastname) {
          professorId = el._id
        }
      })

      if (professorId !== 0) {
        coursesList.push(new CourseModel({
          subject: element.subject,
          grade: 'B1 G1',
          bts: element.bts,
          professor: professorId,
          courses: [
            {
              date: element.date,
              weekday: element.weekday.charAt(0).toUpperCase() + element.weekday.slice(1),
              start: element.start,
              end: element.end,
              room: element.room
            }
          ]
        }))
      }
    })

    // Delete all professors and courses from the database
    await ProfessorModel.deleteMany({})
    await CourseModel.deleteMany({})

    // Push all professors and courses in the database
    await ProfessorModel.insertMany(professorsList).then(() => {
      logger.info(`=> inserted all professors`)
    })
    await CourseModel.insertMany(coursesList).then(() => {
      logger.info(`=> inserted all courses`)
    })

    // Sera utilisé pour le cron
    cron.schedule('* * 3 * *', () => {
      // do things
    })
  } catch (err) {
    logger.error(err)
  }
}

async function findUsers () {
  return new Promise(async (resolve) => {
    const groups = ['B1 G1', 'B1 G2', 'B2 G1', 'B2 G2', 'B3 G1', 'B3 G2', 'B3 G3', 'I4 G1', 'I4 G2', 'I5 G1', 'I5 G2']
    let result = {}
    let coursesList = []
    let professorsList = []

    // Async foreach function
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    // Get one user for each froup in the database
    await asyncForEach(groups, async (el) => {
      const user = await UserModel.findOne({ grade: el }, 'firstname lastname')
      if (user) {
        // Get the courses of the user
        let courses = await getCourses(user.firstname.toLowerCase(), user.lastname.toLowerCase())
        coursesList.push(courses)
        courses.forEach(function (element) {
          if (!professorsList.includes(element.professor) && element.professor !== '') {
            professorsList.push(element.professor)
          }
        })
      }

      const keyCourses = 'courses'
      result[keyCourses] = coursesList[0]

      const keyProfessors = 'professors'
      result[keyProfessors] = professorsList
    })

    resolve(result)
  })
}

async function getCourses (firstname, lastname) {
  return new Promise(async (resolve) => {
    // init the response object
    const result = []
    let dateStart = '09/03/18'

    // loop while the end date isn't reached
    while (moment(dateStart, 'MM/DD/YY') <= moment('07/15/19', 'MM/DD/YY')) {
      console.log(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${dateStart}%208:00`)
      await request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${dateStart}%208:00`, (err, resp, html) => {
        if (err || !html || resp.statusCode !== 200) {
          logger.error(err)
          return 'An error has occured whilst trying to scrape the agenda'
        }

        // load html in $ variable
        const $ = cheerio.load(html, { decodeEntities: true })
        const days = $('div.BJour')

        days.each(function (day, el) {
          const theDay = day
          const courses = $('div.Case')
          const leftCss = parseFloat($(el).css('left')).toFixed(2)

          courses.each(function (course, el) {
            if (parseFloat($(el).css('left')).toFixed(2) !== leftCss || !$('.TCJour').eq(course)) return

            let day = $('.TCJour').eq(theDay)
            day = day.html()

            // date
            const dayDate = day.substr(day.length - 11, 2)
            const dayMonth = dateTranslator.getMonth(day.substr(day.length - 8, 3))
            const dayYear = day.substr(day.length - 4, 4)
            const weekday = dateTranslator.getDayFromString(day)
            const date = `${dayDate}/${dayMonth}/${dayYear}`

            // time
            const start = $(el).children('table').children('tbody').children('tr').children('td.TChdeb').html().substr(0, 5)
            const end = $(el).children('table').children('tbody').children('tr').children('td.TChdeb').html().substr(8, 5)

            // other informations
            const subject = $(el).children('table').children('tbody').children('tr').children('td.TCase').text()
            let professor = $(el).children('table').children('tbody').children('tr').children('td.TCProf').html()
            const bts = professor.includes('BTS')
            professor = professor.split('<br>')[1]
            const room = $(el).children('table').children('tbody').children('tr').children('td.TCSalle').html().replace(/Salle:/, '')

            const data = {
              date,
              subject,
              start,
              end,
              professor,
              room,
              weekday,
              bts
            }
            // push the data in the response object
            result.push(data)
          })
        })
      })

      // increment date
      dateStart = moment(dateStart, 'MM/DD/YY').add(7, 'days').format('MM/DD/YY')
    }

    // return the response
    resolve(result)
  })
}
