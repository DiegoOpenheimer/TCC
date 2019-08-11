const router = require('express').Router()
const jwt = require('./validation/jwt')
const validation = require('./validation/user')
const newsController = require('../controller/news')
const validationFields = validation.handleField('author', 'title', 'message')

router.get('/', jwt, newsController.getNews)

router.put('/', jwt, validationFields, newsController.editNews)

router.post('/', jwt, validationFields, newsController.createNews)

router.delete('/:id', jwt, newsController.removeNews)

router.get('/:id', jwt, newsController.getNewsById)

module.exports = router