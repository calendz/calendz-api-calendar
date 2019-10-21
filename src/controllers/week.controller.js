const moment = require('moment')
const request = require('request')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

// get courses of current week
exports.get = async (req, res) => {
  // firstname and lastname params for the request
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  // get current date and format with moment
  const _date = new Date()
  let date = moment(_date, 'MM-DD-YY').format('MM/DD/YY')

  if (moment(date, 'MM/DD/YY').day() === 0) date = moment(date, 'MM/DD/YY').add(1, 'days').format('MM/DD/YY')

  // execute the request
  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

// get courses for a specific week with date param
exports.getByDate = async (req, res) => {
  // get firstname, lastname and date params for the request
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const _date = req.params.date

  // format the date with moment
  const date = moment(_date, 'MM-DD-YY').format('MM/DD/YY')

  // execute the request
  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

async function query (res, firstname, lastname, dateScrap) {
  return new Promise((resolve) => {
    request(`https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=i&Tel=${firstname}.${lastname}&date=${dateScrap}`, (err, resp, html) => {
      /* istanbul ignore if */
      if (err || !html || resp.statusCode !== 200) {
        logger.error(err)
        return res.status(500).json({
          message: 'An error has occured whilst trying to scrape the agenda'
        })
      }
      // init the response object
      let result = {}
      const key = 'week'
      result[key] = {}

      // load the html of the page in the $ variable
      const $ = cheerio.load(html, { decodeEntities: false })

      // get all days of the week in days variable
      const days = $('div.Jour')

      days.each(function (day, el) {
        const theDay = day
        const courses = $('div.Case')
        const leftCss = Math.ceil(parseFloat($(el).css('left')).toFixed(1) + 100)

        // loop on each course of the week
        courses.each(function (course, el) {
          // if the course belongs to the day

          if (Math.floor(parseFloat($(el).css('left')).toFixed(1)) !== Math.floor((parseFloat(parseFloat(leftCss) + 9)).toFixed(1))) if (Math.ceil(parseFloat($(el).css('left')).toFixed(2)) !== leftCss || !$('.TCJour').eq(course)) return

          let day = $('.TCJour').eq(theDay)
          day = day.html().split(' ')

          // date
          const dayDate = day[1]
          const dayMonth = dateTranslator.getMonth(day[2])
          const weekday = day[0].toLowerCase()
          const year = '20' + dateScrap.split('/')[2]
          const date = `${dayDate}/${dayMonth}/${year}`

          // time
          const start = $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TChdeb').html().substr(0, 5)
          const end = $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TChdeb').html().substr(8, 5)

          // other informations
          const subject = $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCase').text()
          let professor = $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCProf').html()
          const bts = professor.includes('BTS')
          professor = professor.split('<br>')[0]
          const room = $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCSalle').html().replace(/Salle:/, '')

          // presence
          let presence
          if ($(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCase').children('.Presence').html() === '<img src="/img/valide.png">' || $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCase').children('.Presence').html() === '') {
            presence = true
          } else {
            presence = false
          }

          const data = {
            date,
            subject,
            start,
            end,
            professor,
            room,
            weekday,
            bts,
            presence
          }

          if (result[key][weekday]) {
            result[key][weekday].push(data)
          } else {
            result[key][weekday] = []
            result[key][weekday].push(data)
          }
        })
      })
      // return response object
      result = regroupCourses(result)
      resolve(result)
    })
  })
}

function regroupCourses (result) {
  let response = {}
  const key = 'week'
  response[key] = {}

  for (let [, courses] of Object.entries(result['week'])) {
    for (let i = 0; i <= courses.length - 1; i++) {
      if (courses[i + 1] !== undefined) {
        if (courses[i].date === courses[i + 1].date && courses[i].subject === courses[i + 1].subject && courses[i].end === courses[i + 1].start && courses[i].professor === courses[i + 1].professor && courses[i].room === courses[i + 1].room && courses[i].weekday === courses[i + 1].weekday && courses[i].bts === courses[i + 1].bts) {
          const course = courses[i]
          course.end = courses[i + 1].end
          response = pushCoursesUtil(response, key, course)
          i++
        } else {
          response = pushCoursesUtil(response, key, courses[i])
        }
      } else {
        response = pushCoursesUtil(response, key, courses[i])
      }
    }
  }
  return response
}

function pushCoursesUtil (response, key, course) {
  if (response[key][course.weekday]) {
    response[key][course.weekday].push(course)
  } else {
    response[key][course.weekday] = []
    response[key][course.weekday].push(course)
  }
  return response
}
