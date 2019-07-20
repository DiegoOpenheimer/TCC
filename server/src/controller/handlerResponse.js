const logger = require('../utils/logger')
const History  = require('../model/history')

const handlerResponse = (res, payload, ...histories) => {
    const status = payload && typeof payload.status === 'number' ? payload.status : 200
    res.status(status).send(payload)
    if (histories && histories.length) {
        histories.forEach(history => History.create(history))
    }
}

const handlerUnexpectError = (res, message) => {
    handlerResponse(res, { message: 'Unexpected error', status: 500 })
    logger.error(message)
}


module.exports = {
    handlerResponse,
    handlerUnexpectError,
    History: class History {
        constructor(reason, email) {
            this.reason = reason
            this.email = email
        }
    }
}