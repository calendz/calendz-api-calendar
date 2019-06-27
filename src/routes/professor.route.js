const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const ProfessorValidationMiddleware = require('../middlewares/professor.validation.middleware')
const UserValidateMiddleware = require('../middlewares/user.validation.middleware')
const ProfessorController = require('../controllers/professor.controller')

const router = express.Router()

router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidateMiddleware.hasFirstnameAndLastname,
  ProfessorController.get
])

router.get('/:professor', [
  AuthValidationMiddleware.validTokenNeeded,
  UserValidateMiddleware.hasFirstnameAndLastname,
  ProfessorValidationMiddleware.hasProfessorField,
  ProfessorController.getByName
])

module.exports = router
