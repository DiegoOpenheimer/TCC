const router = require('express').Router()
const jwt = require('./validation/jwt')
const validation = require('./validation/user')
const lineController = require('../controller/lines')
const validationEmployee = require('./validation/employee')
const validationFields = validation.handleField('number', 'description', 'routes', 'directions')

router.get('/associate', jwt, lineController.getLinesToAssociate)

router.get('/', jwt, lineController.getLines)

router.get('/count', jwt, lineController.lineAmount)

router.get('/score', jwt, validationEmployee.verifyIfEmployeeIsAdmin, lineController.getScoreLine)

router.get('/score/:id', jwt, validationEmployee.verifyIfEmployeeIsAdmin, lineController.getScore)

router.put('/', jwt, validationFields, lineController.editLine)

router.post('/', jwt, validationFields, lineController.createLine)

router.delete('/:id', jwt, lineController.removeLine)

router.get('/:id', jwt, lineController.getLineById)

module.exports = router