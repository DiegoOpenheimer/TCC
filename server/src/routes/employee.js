const router = require('express').Router()
const employeeController = require('../controller/employee')
const validation = require('./validation/user')
const validationJwt = require('./validation/jwt')

router.post('/', validation.handlerCreateUser, employeeController.createEmployee)

router.get('/', validationJwt, employeeController.getActiveEmployee)

router.delete('/', validationJwt, employeeController.removeEmployee)

router.get('/current', validationJwt, employeeController.getEmployeeByEmail)

router.get('/recover-password/:id', validation.validationId, employeeController.renderPageToChangePassword)

router.get('/not_authorized', validationJwt, employeeController.getEmployeeNotAuthorized)

router.post('/recover-password', validation.handleField('email'), employeeController.recoverPassword)

router.get('/:id', validation.validationId, employeeController.enableAccount)

router.patch('/edit', validationJwt, validation.handleField('name', 'cpf'), employeeController.editEmployee)

router.patch('/change-password', validationJwt, validation.handleField('password'), employeeController.changePassword)

module.exports = router