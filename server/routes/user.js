const router = require('express').Router()
const userController = require('../controller/user')
const validation = require('./validation/user')

router.post('/', validation.handlerCreateUser, userController.createUser)

router.get('/:id', validation.handlerConfirmAccount, userController.enableAccount)


module.exports = router