const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const UserValidationMiddleware = require('../middlewares/user.validation.middleware')
const DateValidationMiddleware = require('../middlewares/date.validation.middleware')
const DayController = require('../controllers/day.controller')

const router = express.Router()

// Get les cours de la journées actuelle
router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  DayController.get
])

// Get les cours du jour indiqué
router.get('/:date', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  DateValidationMiddleware.hasValidDate,
  DayController.getByDate
])

module.exports = router
