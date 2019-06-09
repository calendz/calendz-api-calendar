const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const UserValidationMiddleware = require('../middlewares/user.validation.middleware')
const DayController = require('../controllers/day.controller')

const router = express.Router()

/**
 * @api {get} /api/v1/day Get current day
 * @apiVersion 1.0.0
 * @apiName GetToday
 * @apiDescription This method gets all courses of the current date (calculated when the route is called).
 * @apiGroup Day
 * @apiPermission User
 *
 * @apiUse UserParams
 *
 * @apiSuccess (Success 200) {Array}  courses          List of all courses of today
 * @apiSuccess (Success 200) {String} course.date      Course's date
 * @apiSuccess (Success 200) {String} course.subject   Course's subject
 * @apiSuccess (Success 200) {String} course.sart      Course's beginning hour
 * @apiSuccess (Success 200) {String} course.end       Course's end hour
 * @apiSuccess (Success 200) {String} course.professor Course's professor
 * @apiSuccess (Success 200) {String} course.room      Course's building and room number
 * @apiSuccess (Success 200) {String} course.weekday   Course's weekday (in french)
 *
 * @apiSuccessExample {JSON} Response (example):
 *     HTTP/1.1 200 Success
 *     {
 *        "courses": [
 *           {
 *              "date": "03/18/19",
 *              "subject": "LANGAGE C#  - TESTS ",
 *              "start": "11:00",
 *              "end": "13:00",
 *              "professor": "CHEVALIER NICOLAS",
 *              "room": "B206-A-",
 *              "weekday": "Lundi"
 *           },
 *           {
 *              "date": "03/18/19",
 *              "subject": "PROJ. TRANS. DÉV. AP",
 *              "start": "14:00",
 *              "end": "18:00",
 *              "professor": "CHEVALIER NICOLAS",
 *              "room": "L230-N-",
 *              "weekday": "Lundi"
 *           }
 *        ]
 *     }
 *
 * @apiUse UserErrors
 */
router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  DayController.get
])

/**
 * @api {get} /api/v1/day/:date Get day by date
 * @apiVersion 1.0.0
 * @apiName GetDay
 * @apiDescription This method gets all courses of the given date (in <code>MM-DD-YY</code> format!).
 * @apiGroup Day
 * @apiPermission User
 *
 * @apiUse UserParams
 * @apiUse DateParam
 *
 * @apiExample {js} Example :
 * https://edt.alexandretuet.com/api/v1/day/03-20-19
 *
 * @apiSuccess (Success 200) {Array}  courses          List of all courses of the given date
 * @apiSuccess (Success 200) {String} course.date      Course's date
 * @apiSuccess (Success 200) {String} course.subject   Course's subject
 * @apiSuccess (Success 200) {String} course.sart      Course's beginning hour
 * @apiSuccess (Success 200) {String} course.end       Course's end hour
 * @apiSuccess (Success 200) {String} course.professor Course's professor
 * @apiSuccess (Success 200) {String} course.room      Course's building and room number
 * @apiSuccess (Success 200) {String} course.weekday   Course's weekday (in french)
 *
 * @apiSuccessExample {JSON} Response (example):
 *     HTTP/1.1 200 Success
 *     {
 *        "courses": [
 *           {
 *              "date": "03/18/19",
 *              "subject": "LANGAGE C#  - TESTS ",
 *              "start": "11:00",
 *              "end": "13:00",
 *              "professor": "CHEVALIER NICOLAS",
 *              "room": "B206-A-",
 *              "weekday": "Lundi"
 *           },
 *           {
 *              "date": "03/18/19",
 *              "subject": "PROJ. TRANS. DÉV. AP",
 *              "start": "14:00",
 *              "end": "18:00",
 *              "professor": "CHEVALIER NICOLAS",
 *              "room": "L230-N-",
 *              "weekday": "Lundi"
 *           }
 *        ]
 *     }
 *
 * @apiUse UserErrors
 */
router.get('/:date', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  DayController.getByDate
])

module.exports = router
