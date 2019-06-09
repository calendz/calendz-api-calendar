const express = require('express')
const dayRoutes = require('../routes/day.route')
const weekRoutes = require('../routes/week.route.js')

const router = express.Router()

/**
 * @api {get} /api/v1/health-check Check if API is running
 * @apiVersion 1.0.0
 * @apiName HealthCheck
 * @apiDescription Use this route to see if API is working correctly or not
 * @apiGroup Others
 *
 * @apiSuccess (Success 200) OK API status
 */
router.get('/health-check', (req, res) => { res.send('OK') })

router.use('/day', dayRoutes)
router.use('/week', weekRoutes)

/**
 * @apiDefine User User Permission
 * You need to provide a valid token in order to access this method
 */

/**
 * @apiDefine UserParams User parameters
 * @apiParam {String} firstname Firstname
 * @apiParam {String} lastname  Lastname
 */

/**
 * @apiDefine DateParam Date parameter
 * @apiParam {String} date Date as a string (formatted in <code>MM/DD/YY</code>)
 */

/**
 * @apiDefine UserErrors
 * @apiError MissingUserInformations You must provide valid <code>firstname</code> & <code>lastname</code> in order to access the user's schedule
 */

module.exports = router
