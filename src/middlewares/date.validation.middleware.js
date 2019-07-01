
const moment = require('moment')

exports.hasValidDate = (req, res, next) => {
  const _date = req.params.date
  const date1 = moment(_date, 'MM-DD-YY').format('MM/DD/YY')
  const date2 = new Date(_date)

  if (!_date) {
    return res.status(412).json({
      message: 'Missing date field'
    })
  }

  let dd = date2.getDate()
  let mm = date2.getMonth() + 1

  const yy = date2.getFullYear().toString().substr(-2)
  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  if (date1 !== `${mm}/${dd}/${yy}`) {
    return res.status(409).json({
      message: 'Invalid date format'
    })
  }

  return next()
}
