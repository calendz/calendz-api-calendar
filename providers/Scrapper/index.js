'use strict'

const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')

const dateUtils = use('DateUtils')

class Scrapper {
  /**
   | --------------------------------------------------------------
   | Get week courses of a given date for a given student
   | --------------------------------------------------------------
  */

  async fetchWeek (firstname, lastname, queriedDate) {
    let result = null
    let success = false

    while (!success) {
      result = await this.scrapWeek(firstname, lastname, queriedDate)
        .then((res) => { success = true; return res })
        .catch((err) => { if (err.message !== 'E_SCRAPPING_PARAMETERS') success = true })
    }

    return result
  }

  async scrapWeek (firstname, lastname, queriedDate) {
    return new Promise((resolve, reject) => {
      const CALENDAR_URL_TO_SCRAP = 'https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=i'

      request(`${CALENDAR_URL_TO_SCRAP}&Tel=${firstname}.${lastname}&date=${queriedDate}`, (err, resp, html) => {
        /* istanbul ignore if */
        if (err || !html || resp.statusCode !== 200) return reject(new Error('An error has occurred whilst trying to scrape the agenda'))
        /* istanbul ignore if */
        if (html.includes('Erreur de parametres')) return reject(new Error('E_SCRAPPING_PARAMETERS'))

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
            const dayMonth = dateUtils.getMonth(day[2])
            const weekday = day[0].toLowerCase()
            const year = '20' + queriedDate.split('/')[2]
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
            /* istanbul ignore else */
            if ($(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCase').children('.Presence').html() === '<img src="/img/valide.png">' || $(el).children('.innerCase').children('.BackGroundCase').children('table').children('tbody').children('tr').children('td.TCase').children('.Presence').html() === '') {
              presence = true
            } else {
              presence = false
            }

            const data = { date, subject, start, end, professor, room, weekday, bts, presence }

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

  /**
   | --------------------------------------------------------------
   | Get day courses of a given date for a given student
   | --------------------------------------------------------------
  */

  async fetchDay (firstname, lastname, queriedDate) {
    let result = null
    let success = false

    while (!success) {
      result = await this.scrapDay(firstname, lastname, queriedDate)
        .then((res) => { success = true; return res })
        .catch((err) => { if (err.message !== 'E_SCRAPPING_PARAMETERS') success = true })
    }

    return result
  }

  async scrapDay (firstname, lastname, date) {
    return new Promise((resolve, reject) => {
      const CALENDAR_URL_TO_SCRAP = 'http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=i'

      request(`${CALENDAR_URL_TO_SCRAP}&tel=${firstname}.${lastname}&date=${date}%208:00`, (err, resp, html) => {
        /* istanbul ignore if */
        if (err || !html || resp.statusCode !== 200) {
          reject(new Error('An error has occurred whilst trying to scrape the agenda'))
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
          const weekday = dateUtils.getDayFromInt(moment(date, 'MM/DD/YY').day())

          const data = { date, subject, start, end, professor, room, weekday }

          // push the data in the response object
          result[key].push(data)
        })
        // return the response
        resolve(result)
      })
    })
  }

  /**
   | --------------------------------------------------------------
   | Get Microsoft Teams current links
   | --------------------------------------------------------------
  */

  async fetchTeamsLinks (firstname, lastname) {
    // get current date and format with moment
    const date = moment(new Date()).format('MM/DD/YYYY')

    return new Promise((resolve, reject) => {
      const CALENDAR_URL_TO_SCRAP = 'https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=i'

      request(`${CALENDAR_URL_TO_SCRAP}&Tel=${firstname}.${lastname}&date=${date}`, (err, resp, html) => {
        /* istanbul ignore if */
        if (err || !html || resp.statusCode !== 200) return reject(new Error('An error has occurred whilst trying to scrape the agenda'))
        /* istanbul ignore if */
        if (html.includes('Erreur de parametres')) return reject(new Error('E_SCRAPPING_PARAMETERS'))

        // init the response object
        const result = []

        // load the html of the page in the $ variable
        const $ = cheerio.load(html, { decodeEntities: false })

        $('div.Teams').each((i, el) => {
          $(el).children('a').each((i, el) => {
            const subject = $(el).parent().parent().text()
            const link = $(el).attr('href')
            const start = $(el).parent().parent().parent().parent().children('tr').children('td.TChdeb').html().substr(0, 5)
            const end = $(el).parent().parent().parent().parent().children('tr').children('td.TChdeb').html().substr(8, 5)

            // add subject if it doesn't exist
            const index = result.findIndex(el => el.subject === subject && el.start === start && el.end === end)
            if (index === -1) {
              result.push({ subject, start, end, links: [link] })
            } else {
              result[index].links.push(link)
            }
          })
        })

        // return response object
        resolve(result)
      })
    })
  }
}

function regroupCourses (result) {
  let response = {}
  const key = 'week'
  response[key] = {}

  for (const [, courses] of Object.entries(result.week)) {
    for (let i = 0; i <= courses.length - 1; i++) {
      if (courses[i + 1] !== undefined) {
        /* istanbul ignore if */
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

module.exports = Scrapper
