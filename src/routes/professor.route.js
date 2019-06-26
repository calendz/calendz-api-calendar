const express = require('express')
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const ProfessorValidationMiddleware = require('../middlewares/professor.validation.middleware')
const ProfessorController = require('../controllers/professor.controller')

const router = express.Router()

router.get('/', [
  AuthValidationMiddleware.validTokenNeeded,
  ProfessorValidationMiddleware.hasFirstnameAndLastname,
  ProfessorController.get
])

router.get('/:professor', [
  AuthValidationMiddleware.validTokenNeeded,
  ProfessorValidationMiddleware.hasFirstnameAndLastname,
  ProfessorController.getByName
])

module.exports = router
