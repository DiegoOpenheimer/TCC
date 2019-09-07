const logger = require('../utils/logger')

const Employee = require('../model/employee')

const constants = require('../utils/constants')

const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const connectMongoDb = () => mongoose.connect(process.env.MONGODB || 'mongodb://localhost/tcc', { useNewUrlParser: true })

const listenOnError = () => mongoose.connection.on('error', err => {
    logger.error(`ERROR MONGODB ${err}`)
})

const init = () => {
    listenOnError()
    Employee.findOne({ role: constants.EMPLOYEE_ROLE.ADMIN })
    .then(employee => {
        if (!employee) {
            const user = {
                name: 'admin',
                password: 'admin',
                role: constants.EMPLOYEE_ROLE.ADMIN,
                status: constants.USER_STATUS.ENABLED,
            }
            Employee.create(user)
            .catch(logger.error)
        }
    }).catch(err => {
        logger.error(`Error to verify employee ${err}`)
    })
}

mongoose.connection.on('close', () => {
    logger.error('MONGODB CLOSED')
    connectMongoDb()
})

mongoose.set('debug', true)

module.exports = {
    connectMongoDb,
    listenOnError,
    init
}