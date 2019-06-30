const moment = require('moment')
const request = require('request-promise')
const cheerio = require('cheerio')
const logger = require('../config/winston')
const dateTranslator = require('../utils/dateTranslator')

// get professors list with date of first and last cours
exports.get = async (req, res) => {
  // get firstname and lastname params
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname

  // init date with 09/03/18
  const date = moment('09-03-18', 'MM-DD-YY').format('MM/DD/YY')

  // execute the request
  await queryAll(res, _firstname, _lastname, date).then((result) => {
    return res.status(200).json(result)
  })
}

// get list of courses with a given name of professor
exports.getByName = async (req, res) => {
  // get firstname, lastname and professor name params
  const _firstname = req.query.firstname
  const _lastname = req.query.lastname
  const _professor = req.params.professor

  // init date start and date end of the request. If there is no date provided
  // dates are manualy set
  let dateStart
  let dateEnd
  if (req.query.dateStart && req.query.dateEnd) {
    dateStart = moment(req.query.dateStart, 'MM-DD-YY').format('MM/DD/YY')
    dateEnd = moment(req.query.dateEnd, 'MM-DD-YY').format('MM/DD/YY')
  } else {
    dateStart = moment('09-03-18', 'MM-DD-YY').format('MM/DD/YY')
    dateEnd = moment('07/22/19', 'MM/DD/YY')
  }

  // execute the request
  await queryProfessor(res, _firstname, _lastname, _professor, dateStart, dateEnd).then((result) => {
    return res.status(200).json(result)
  })
}

// return list of every course that contains the professor name provided in params
async function queryProfessor (res, firstname, lastname, _professor, dateStart, dateEnd) {
  return new Promise(async (resolve) => {
    // init the response object
    const result = {}
    const key = 'professor'
    result[key] = []

    // loop while the end date isn't reached
    while (moment(dateStart, 'MM/DD/YY') <= moment(dateEnd, 'MM/DD/YY')) {
      await request(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=i&Tel=${firstname}.${lastname}&date=${dateStart}%208:00`, (err, resp, html) => {
        if (err || !html || resp.statusCode !== 200) {
          logger.error(err)
          return res.status(500).json({ error: 'An error has occured whilst trying to scrape the agenda' })
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

            // if the course professor includes the professor params we provide, then we save the course
            if (professor.toLowerCase().includes(_professor.toLowerCase())) {
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
              result[key].push(data)
            }
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

// get list of all professors of the year with date start and date end of each
async function queryAll (res, firstname, lastname, date) {
  return new Promise(async (resolve) => {
    // init response object
    const result = []

    // init professors array that will contain every different professor
    let professors = []

    // loop while the end date isn't reached
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
            const date = `${dayDate}/${dayMonth}/${dayYear}`

            // other informations
            let professor = $(el).children('table').children('tbody').children('tr').children('td.TCProf').html()
            professor = professor.split('<br>')[1]

            // if professors array is empty, we push the professor with date start and date end with the current date
            if (professors.length === 0) {
              professors.push({
                professor: professor.toLowerCase(),
                dateStart: date,
                dateEnd: date
              })
            } else {
              // loop on the professors array to find if the professor is in the array,
              // if the professor is in the array, we update the date end
              let found = false
              for (let i = 0; i < professors.length; i++) {
                if (professors[i].professor === professor.toLowerCase() && professor !== '') {
                  professors[i].dateEnd = date
                  found = true
                }
              }
              // else, we add the course in the array
              if (found === false) {
                professors.push({
                  professor: professor.toLowerCase(),
                  dateStart: date,
                  dateEnd: date
                })
              }
            }
          })
        })
      })
      // increment the date
      date = moment(date, 'MM/DD/YY').add(7, 'days').format('MM/DD/YY')
    }

    // loop on the professors array to push every professor in the result object
    for (let j = 0; j < professors.length; j++) {
      result.push(professors[j])
    }
    // return the response
    resolve(result)
  })
}
