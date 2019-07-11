const router = require('express').Router()
const validation = require('./validation/auth')
const authController = require('../controller/auth')
const User = require('../model/user')
const Employee = require('../model/employee')

router.post('/user', validation.validateFields, authController.authenticate(User))
router.post('/employee', validation.validateFields, authController.authenticate(Employee))
module.exports = router