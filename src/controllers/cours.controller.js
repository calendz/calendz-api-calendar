const moment = require('moment')
const request = require('request-promise')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

// lists all existing users
exports.get = async (req, res) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const date = moment('09-03-18', 'MM-DD-YY').format('MM/DD/YY')

  await queryAll(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

exports.getByName = async (req, res) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const _cours = req.params.cours

  const date = moment('09-03-18', 'MM-DD-YY').format('MM/DD/YY')

  await queryCours(res, _firstname, _lastname, _cours, date).then((result) => {
    return res.status(200).json(result)
  })
}

async function queryCours (res, firstname, lastname, _cours, date) {
  return new Promise(async (resolve) => {
    const result = {}
    const key = 'cours'
    result[key] = []
    while (moment(date, 'MM/DD/YY') <= moment('07/22/19', 'MM/DD/YY')) {
      await request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
        if (err || !html || resp.statusCode !== 200) {
          logger.error(err)
          return res.status(500).json({ error: 'An error has occured whilst trying to scrape the agenda' })
        }

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

            if (subject.toLowerCase().includes(_cours.toLowerCase())) {
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

              result[key].push(data)
            }
          })
        })
      })

      date = moment(date, 'MM/DD/YY').add(7, 'days').format('MM/DD/YY')
    }

    resolve(result)
  })
}

async function queryAll (res, firstname, lastname, date) {
  return new Promise(async (resolve) => {
    const result = []
    let cours = []
    while (moment(date, 'MM/DD/YY') <= moment('07/22/19', 'MM/DD/YY')) {
      await request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
        if (err || !html || resp.statusCode !== 200) {
          logger.error(err)
          return res.status(500).json({ error: 'An error has occured whilst trying to scrape the agenda' })
        }
        const $ = cheerio.load(html, { decodeEntities: true })
        const days = $('div.BJour')

        days.each(function (day, el) {
          const courses = $('div.Case')
          const leftCss = parseFloat($(el).css('left')).toFixed(2)

          courses.each(function (course, el) {
            if (parseFloat($(el).css('left')).toFixed(2) !== leftCss || !$('.TCJour').eq(course)) return

            // other informations
            const subject = $(el).children('table').children('tbody').children('tr').children('td.TCase').text()

            if (cours.length === 0) {
              result.push(subject)
              cours.push(subject.toLowerCase())
            } else {
              if (!cours.includes(subject.toLowerCase()) && subject !== '') {
                result.push(subject)
                cours.push(subject.toLowerCase())
              }
            }
          })
        })
      })

      date = moment(date, 'MM/DD/YY').add(7, 'days').format('MM/DD/YY')
    }
    resolve(result)
  })
}
