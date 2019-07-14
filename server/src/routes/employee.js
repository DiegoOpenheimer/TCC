const router = require('express').Router()
const employeeController = require('../controller/employee')
const validation = require('./validation/user')
const validationJwt = require('./validation/jwt')

router.post('/', validation.handlerCreateUser, employeeController.createEmployee)

router.get('/recover-password/:id', validation.validationId, employeeController.renderPageToChangePassword)

router.get('/not_authorized', validationJwt, employeeController.getEmployeeNotAuthorized)

router.post('/recover-password', validation.handlerRecoverPassword('email'), employeeController.recoverPassword)

router.get('/:id', validation.validationId, employeeController.enableAccount)

router.patch('/change-password', validationJwt, validation.handlerRecoverPassword('password'), employeeController.changePassword)

module.exports = router