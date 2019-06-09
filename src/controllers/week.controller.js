const moment = require('moment')
const request = require('request')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

// lists all existing users
exports.get = async (req, res) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const _date = new Date()
  const date = moment(_date, 'MM-DD-YY').format('MM/DD/YY')

  // TODO: fix this
  // if querying during weekend -> show next weeks planning
  // if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
  //   date.add(1, 'days')
  // }

  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

exports.getByDate = async (req, res) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const _date = req.params.date

  const date = moment(_date, 'MM-DD-YY').format('MM/DD/YY')

  if (!date) {
    return res.status(412).json({ error: 'Invalid date format' })
  }

  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

async function query (res, firstname, lastname, date) {
  return new Promise((resolve) => {
    request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
      if (err || !html || resp.statusCode !== 200) {
        logger.error(err)
        return res.status(500).json({ error: 'An error has occured whilst trying to scrape the agenda' })
      }

      const $ = cheerio.load(html, { decodeEntities: true })
      const days = $('div.BJour')

      const result = {}
      const key = 'week'
      result[key] = {}

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

          if (result[key][weekday]) {
            result[key][weekday].push(data)
          } else {
            result[key][weekday] = []
            result[key][weekday].push(data)
          }
        })
      })
      resolve(result)
    })
  })
}
