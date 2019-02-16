const router = require('express').Router()
const validation = require('./validation/auth')
const authController = require('../controller/auth')
router.post('/', validation.validateFields, authController.authenticate)
module.exports = router