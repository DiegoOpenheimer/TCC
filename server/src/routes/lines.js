const router = require('express').Router()
const jwt = require('./validation/jwt')
const validation = require('./validation/user')
const lineController = require('../controller/lines')
const validationFields = validation.handleField('number', 'description', 'routes', 'directions')

router.get('/associate', jwt, lineController.getLinesToAssociate)

router.get('/', jwt, lineController.getLines)

router.put('/', jwt, validationFields, lineController.editLine)

router.post('/', jwt, validationFields, lineController.createLine)

router.delete('/:id', jwt, lineController.removeLine)

router.get('/:id', jwt, lineController.getLineById)

module.exports = router