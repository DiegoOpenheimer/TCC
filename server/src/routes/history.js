const router = require('express').Router()
const validationJwt = require('./validation/jwt')
const historyController = require('../controller/history')
const employeeValidation = require('./validation/employee')

router.use(employeeValidation.verifyIfEmployeeIsAdmin)

router.get('/', validationJwt, historyController.getHistories)

module.exports = router