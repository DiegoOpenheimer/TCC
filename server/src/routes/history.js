const router = require('express').Router()
const validationJwt = require('./validation/jwt')
const historyController = require('../controller/history')

router.get('/', validationJwt, historyController.getHistories)

module.exports = router