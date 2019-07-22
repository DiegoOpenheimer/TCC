const router = require('express').Router()
const suggestionController = require('../controller/suggestion')
const validationJwt = require('./validation/jwt')
const validation = require('./validation/user')

router.get('/', validationJwt, suggestionController.getSuggestions)

router.get('/:id', validationJwt, validation.validationId, suggestionController.getSuggestionById)

router.post('/', validationJwt, suggestionController.registerSuggestion)

router.patch('/', validationJwt, suggestionController.addMessage)

router.delete('/', validationJwt, suggestionController.removeSuggestion)

router.delete('/message', validationJwt, suggestionController.removeMessage)

module.exports = router