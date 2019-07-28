const router = require('express').Router()
const userController = require('../controller/user')
const validation = require('./validation/user')
const validationJwt = require('./validation/jwt')

router.post('/', validation.handlerCreateUser, userController.createUser)

router.get('/count', validationJwt, userController.userAmount)

router.get('/logged', validationJwt, userController.getUserLogged)

router.put('/', validationJwt, userController.editUser)

router.post('/recover-password', validation.handleField('email'), userController.recoverPassword)

router.get('/recover-password/:id', validation.validationId, userController.renderPageToChangePassword)

router.patch('/change-password', validationJwt, validation.handleField('password'), userController.changePassword)

router.get('/:id', validation.validationId, userController.enableAccount)

module.exports = router