const moment = require('moment')
const request = require('request')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

exports.get = async (req, res) => {
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  const date = moment(new Date(), 'MM-DD-YY').format('MM/DD/YY')

  // TODO: should we implement this?
  // if querying during weekend -> show next weeks planning
  // if (date.isoWeekday() === 6) {
  //   date.add(2, 'days')
  // }
  // if (date.isoWeekday() === 7) {
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
    request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=i&tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
      if (err || !html || resp.statusCode !== 200) {
        logger.error(err)
        return res.status(500).json({ error: 'An error has occured whilst trying to scrape the agenda' })
      }

      const $ = cheerio.load(html, { decodeEntities: true })
      const courses = $('div.Ligne')

      const result = {}
      const key = 'courses'
      result[key] = []

      courses.each(function (course, el) {
        const start = $(el).children('div.Debut').text()
        const end = $(el).children('div.Fin').text()
        const subject = $(el).children('div.Matiere').text()
        const professor = $(el).children('div.Prof').text()
        const room = $(el).children('div.Salle').text()
        const weekday = dateTranslator.getDayFromInt(moment(date, 'MM/DD/YY').day())

        const data = {
          date,
          subject,
          start,
          end,
          professor,
          room,
          weekday
        }
        result[key].push(data)
      })
      resolve(result)
    })
  })
}
