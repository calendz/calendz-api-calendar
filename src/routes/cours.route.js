const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const CoursValidationMiddleware = require('../middlewares/cours.validation.middleware')
const UserValidateMiddleware = require('../middlewares/user.validation.middleware')
const CoursController = require('../controllers/cours.controller')

const router = express.Router()

router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidateMiddleware.hasFirstnameAndLastname,
  CoursController.get
])

router.get('/:cours', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidateMiddleware.hasFirstnameAndLastname,
  CoursValidationMiddleware.hasCoursField,
  CoursController.getByName
])

module.exports = router
