const logger = require('../utils/logger')

const handlerResponse = (res, payload) => {
    const status = payload ? payload.status || 200 : 200
    res.status(status).send({ ...payload })
}

const handlerUnexpectError = (res, message) => {
    handlerResponse(res, { message: 'Unexpected error', status: 500 })
    logger.error(message)
}


module.exports = {
    handlerResponse,
    handlerUnexpectError
}