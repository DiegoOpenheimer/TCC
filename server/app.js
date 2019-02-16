const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))

app.use(require('./routes'))

module.exports = app