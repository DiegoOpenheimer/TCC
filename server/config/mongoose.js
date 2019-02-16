const logger = require('../utils/logger')

const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const connectMongoDb = () => mongoose.connect(process.env.MONGODB || 'mongodb://localhost/tcc', { useNewUrlParser: true })

mongoose.connection.on('error', err => {
    logger.error(`ERROR MONGODB ${err}`)
})

mongoose.connection.on('close', () => {
    logger.error('MONGODB CLOSED')
    connectMongoDb()
})

mongoose.set('debug', true)

module.exports = {
    connectMongoDb,
}