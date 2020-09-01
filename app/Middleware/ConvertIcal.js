'use strict'

const ical = require('ical-generator')
const moment = require('moment')

class ConvertIcal {
  async handle ({ response }, next) {
    await next()
    
    if (response.request.headers.accept == 'text/calendar') {
        const cal = ical()
        
        const events = findValuesHelper(response._lazyBody, "date", []);

        events.forEach(event => {
            cal.createEvent({
                start: moment(event.date + ' ' + event.start, "DD/MM/YYYY hh:mm").toDate(),
                end: moment(event.date + ' ' + event.end, "DD/MM/YYYY hh:mm").toDate(),
                summary: event.subject,
                description: event.professor,
                location: event.room
            })
        })

        response._lazyBody.content = cal.toString()
    }
  }
}

function findValuesHelper(obj, key, list) {
    if (!obj) return list;
    if (obj instanceof Array) {
    for (var i in obj) {
        list = list.concat(findValuesHelper(obj[i], key, []));
    }
    return list;
    }
    if (obj[key]) list.push(obj);

    if ((typeof obj == "object") && (obj !== null) ){
        var children = Object.keys(obj);
        if (children.length > 0){
            for (i = 0; i < children.length; i++ ){
            list = list.concat(findValuesHelper(obj[children[i]], key, []));
            }
        }
    }
    return list;
}

module.exports = ConvertIcal