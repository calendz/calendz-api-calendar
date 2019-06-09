const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const UserValidationMiddleware = require('../middlewares/user.validation.middleware')
const WeekController = require('../controllers/week.controller')

const router = express.Router()

/**
 * @api {get} /api/v1/week Get current week
 * @apiVersion 1.0.0
 * @apiName GetCurrentWeek
 * @apiDescription This method gets all courses of the current week we're in
 * @apiGroup Week
 * @apiPermission User
 *
 * @apiUse UserParams
 *
 * @apiExample {js} Example :
 * https://edt.alexandretuet.com/api/v1/week
 *
 * @apiSuccess (Success 200) {Object} week             Object with all Days objects
 * @apiSuccess (Success 200) {Array}  week.lundi       List of all courses of "Lundi"
 * @apiSuccess (Success 200) {Array}  week.mardi       List of all courses of "Mardi"
 * @apiSuccess (Success 200) {Array}  week.mercredi    List of all courses of "Mercredi"
 * @apiSuccess (Success 200) {Array}  week.jeudi       List of all courses of "Jeudi"
 * @apiSuccess (Success 200) {Array}  week.vendredi    List of all courses of "Vendredi"
 * @apiSuccess (Success 200) {Array}  week.samedi      List of all courses of "Samedi"
 * @apiSuccess (Success 200) {Array}  week.dimanche    List of all courses of "Dimanche"
 *
 * @apiSuccessExample {JSON} Response (example):
 *     HTTP/1.1 200 Success
 *     {
 *        "week": {
 *           "lundi": [
 *              {
 *                 "date": "03/18/19",
 *                 "subject": "LANGAGE C#  - TESTS ",
 *                 "start": "11:00",
 *                 "end": "13:00",
 *                 "professor": "CHEVALIER NICOLAS",
 *                 "room": "B206-A-",
 *                 "weekday": "Lundi"
 *                 "bts": false
 *              },
 *              {
 *                 "date": "03/18/19",
 *                 "subject": "LANGAGE C#  - TESTS ",
 *                 "start": "11:00",
 *                 "end": "13:00",
 *                 "professor": "morand-garin isabelle",
 *                 "room": "Salle:L113-(7 LECLAIR)",
 *                 "weekday": "mercredi",
 *                 "bts": true
 *              }
 *           ],
 *           "mardi": [
 *              {
 *                 "date": "03/19/19",
 *                 "subject": "PROJ. TRANS. BDD SQL",
 *                 "start": "09:00",
 *                 "end": "13:00",
 *                 "professor": "mulot mathieu",
 *                 "room": "L225-Cab-(7 LECLAIR)",
 *                 "weekday": "vendredi"
 *                 "bts": false
 *              },
 *              {
 *                 "date": "03/19/19",
 *                 "subject": "SUPERVISION",
 *                 "start": "14:00",
 *                 "end": "16:00",
 *                 "professor": "constans thomas",
 *                 "room": "L230-N-(7 LECLAIR)",
 *                 "weekday": "vendredi"
 *                 "bts": false
 *              }
 *           ]
 *        }
 *     }
 *
 * @apiUse UserErrors
 */
router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  WeekController.get
])

/**
 * @api {get} /api/v1/week/:date Get week by date
 * @apiVersion 1.0.0
 * @apiName GetWeek
 * @apiDescription This method gets all courses of the week of the given date (date in <code>MM-DD-YY</code> format!).
 * @apiGroup Week
 * @apiPermission User
 *
 * @apiUse UserParams
 * @apiUse DateParam
 *
 * @apiExample {js} Example :
 * https://edt.alexandretuet.com/api/v1/week/03-20-19
 *
 * @apiSuccess (Success 200) {Object} week             Object with all Days objects
 * @apiSuccess (Success 200) {Array}  week.lundi       List of all courses of "Lundi"
 * @apiSuccess (Success 200) {Array}  week.mardi       List of all courses of "Mardi"
 * @apiSuccess (Success 200) {Array}  week.mercredi    List of all courses of "Mercredi"
 * @apiSuccess (Success 200) {Array}  week.jeudi       List of all courses of "Jeudi"
 * @apiSuccess (Success 200) {Array}  week.vendredi    List of all courses of "Vendredi"
 * @apiSuccess (Success 200) {Array}  week.samedi      List of all courses of "Samedi"
 * @apiSuccess (Success 200) {Array}  week.dimanche    List of all courses of "Dimanche"
 *
 * @apiSuccessExample {JSON} Response (example):
 *     HTTP/1.1 200 Success
 *     {
 *        "week": {
 *           "lundi": [
 *              {
 *                 "date": "03/18/19",
 *                 "subject": "LANGAGE C#  - TESTS ",
 *                 "start": "11:00",
 *                 "end": "13:00",
 *                 "professor": "CHEVALIER NICOLAS",
 *                 "room": "B206-A-",
 *                 "weekday": "Lundi"
 *                 "bts": false
 *              },
 *              {
 *                 "date": "03/18/19",
 *                 "subject": "LANGAGE C#  - TESTS ",
 *                 "start": "11:00",
 *                 "end": "13:00",
 *                 "professor": "morand-garin isabelle",
 *                 "room": "Salle:L113-(7 LECLAIR)",
 *                 "weekday": "mercredi",
 *                 "bts": true
 *              }
 *           ],
 *           "mardi": [
 *              {
 *                 "date": "03/19/19",
 *                 "subject": "PROJ. TRANS. BDD SQL",
 *                 "start": "09:00",
 *                 "end": "13:00",
 *                 "professor": "mulot mathieu",
 *                 "room": "L225-Cab-(7 LECLAIR)",
 *                 "weekday": "vendredi"
 *                 "bts": false
 *              },
 *              {
 *                 "date": "03/19/19",
 *                 "subject": "SUPERVISION",
 *                 "start": "14:00",
 *                 "end": "16:00",
 *                 "professor": "constans thomas",
 *                 "room": "L230-N-(7 LECLAIR)",
 *                 "weekday": "vendredi"
 *                 "bts": false
 *              }
 *           ]
 *        }
 *     }
 *
 * @apiUse UserErrors
 */
router.get('/:date', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  WeekController.getByDate
])

module.exports = router
