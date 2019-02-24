const router = require('express').Router()
const userController = require('../controller/user')
const validation = require('./validation/user')
const validationJwt = require('./validation/jwt')

router.post('/', validation.handlerCreateUser, userController.createUser)

router.get('/:id', validation.validationId, userController.enableAccount)

router.post('/recover-password', validation.handlerRecoverPassword('email'), userController.recoverPassword)

router.get('/recover-password/:id', validation.validationId, userController.renderPageToChangePassword)

router.patch('/change-password', validationJwt, validation.handlerRecoverPassword('password'), userController.changePassword)

module.exports = router