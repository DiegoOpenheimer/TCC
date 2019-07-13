const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger/swagger.yaml')
const cors = require('cors')

app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(require('./routes'))

module.exports = app