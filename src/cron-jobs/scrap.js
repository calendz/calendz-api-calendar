var cron = require('node-cron')
const moment = require('moment')
const request = require('request-promise')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const UserModel = require('../models/user.model')
const dateTranslator = require('../utils/dateTranslator')

module.exports.initScrap = async function initScrap () {
  try {
    let courses = await findUsers()
    console.log('Cours final : ' + courses)

    // Sera utilisé pour le cron
    cron.schedule('* * 3 * *', () => {
      // do things
    })
  } catch (err) {
    logger.error(err)
  }
}

async function findUsers () {
  const groups = ['B1 G1', 'B1 G2', 'B2 G1', 'B2 G2', 'B3 G1', 'B3 G2', 'B3 G3', 'I4 G1', 'I4 G2', 'I5 G1', 'I5 G2']
  let result = {}
  let coursesList = []
  let professorsList = []

  groups.forEach(async function (el) {
    const user = await UserModel.findOne({ grade: el }, 'firstname lastname')
    if (user) {
      let courses = await getCourses(user.firstname.toLowerCase(), user.lastname.toLowerCase())
      coursesList.push(courses)
      courses.each(function (element) {
        if (!professorsList.includes(element.professor)) {
          professorsList.push(element.professor)
        }
      })
    }

    const keyCourses = 'courses'
    result[keyCourses] = coursesList

    const keyProfessors = 'professors'
    result[keyProfessors] = professorsList
  })

  return result
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
