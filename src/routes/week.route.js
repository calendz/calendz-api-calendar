const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const UserValidationMiddleware = require('../middlewares/user.validation.middleware')
const WeekController = require('../controllers/week.controller')

const router = express.Router()

// Get les cours de la semaine actuelle
router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  WeekController.get
])

// Get les cours de la semaine indiquée
router.get('/:date', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidationMiddleware.hasFirstnameAndLastname,
  WeekController.getByDate
])

module.exports = router
