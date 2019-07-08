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
  const date = moment(_date, 'MM-DD-YY').format('MM/DD/YY')

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

  if (!date) {
    return res.status(412).json({
      message: 'Invalid date format'
    })
  }

  // execute the request
  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

async function query (res, firstname, lastname, date) {
  return new Promise((resolve) => {
    request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
      /* istanbul ignore if */
      if (err || !html || resp.statusCode !== 200) {
        logger.error(err)
        return res.status(500).json({
          message: 'An error has occured whilst trying to scrape the agenda'
        })
      }
      // init the response object
      const result = {}
      const key = 'week'
      result[key] = {}

      // load the html of the page in the $ variable
      const $ = cheerio.load(html, { decodeEntities: true })

      // get all days of the week in days variable
      const days = $('div.BJour')

      days.each(function (day, el) {
        const theDay = day
        const courses = $('div.Case')
        const leftCss = parseFloat($(el).css('left')).toFixed(2)

        // loop on each course of the week
        courses.each(function (course, el) {
          // if the course belongs to the day
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

          // push data in the response object
          if (result[key][weekday]) {
            result[key][weekday].push(data)
          } else {
            result[key][weekday] = []
            result[key][weekday].push(data)
          }
        })
      })
      // return response object
      resolve(result)
    })
  })
}
