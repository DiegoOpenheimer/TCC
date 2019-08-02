const router = require('express').Router()
const jwt = require('./validation/jwt')
const validation = require('./validation/user')
const deviceController = require('../controller/device')
const validationFields = validation.handleField('uuid', 'line')

router.get('/', jwt, deviceController.getDevices)

router.get('/count', jwt, deviceController.deviceAmount)

router.put('/', jwt, deviceController.editDevice)

router.post('/', jwt, validationFields, deviceController.createDevice)

router.delete('/:id', jwt, deviceController.removeDevice)

router.get('/:id', jwt, deviceController.getDeviceById)

module.exports = router