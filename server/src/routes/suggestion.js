const router = require('express').Router()
const suggestionController = require('../controller/suggestion')
const validationJwt = require('./validation/jwt')

router.get('/', validationJwt, suggestionController.getSuggestions)

router.post('/', validationJwt, suggestionController.registerSuggestion)

router.patch('/', validationJwt, suggestionController.addMessage)

router.delete('/', validationJwt, suggestionController.removeSuggestion)

module.exports = router