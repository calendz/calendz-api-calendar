const moment = require('moment')
const request = require('request')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

// get cours of the current day
exports.get = async (req, res) => {
  // firstname and lastname params for the request
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  // get current date and format with moment
  const date = moment(new Date(), 'MM-DD-YY').format('MM/DD/YY')

  // execute the request
  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

// get cours of a specific day with date param
exports.getByDate = async (req, res) => {
  // firstname, lastname and date params
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

  await query(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

async function query (res, firstname, lastname, date) {
  return new Promise((resolve) => {
    request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=i&tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
      if (err || !html || resp.statusCode !== 200) {
        logger.error(err)
        return res.status(500).json({
          message: 'An error has occured whilst trying to scrape the agenda'
        })
      }

      // init the response object
      const result = {}
      const key = 'courses'
      result[key] = []

      // load the html of the page in the $ variable
      const $ = cheerio.load(html, { decodeEntities: true })

      // get all courses in the variable
      const courses = $('div.Ligne')

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

        // push the data in the response object
        result[key].push(data)
      })
      // return the response
      resolve(result)
    })
  })
}
