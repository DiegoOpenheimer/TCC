const HandlerError = require('./handlerError')
const jwt = require('../utils/jwt')
const response = require('./handlerResponse')
const logger = require('../utils/logger')
const constants = require('../utils/constants')

const authenticate = Entity => (req, res) => {
    const user = req.body
    let role
    let name
    const email = user.email
    Entity.findOne({ email: user.email })
    .then(uResult => {
        if (!uResult) {
            return Promise.reject(new HandlerError('user not found', 404))
        } else if (uResult.status !== constants.USER_STATUS.ENABLED) {
            return Promise.reject(new HandlerError('not authorized', 401))
        }
        if ('role' in uResult) {
            role = uResult.role
        }
        name = uResult.name
        return uResult.checkPassword(user.password)
    })
    .then((value) => {
        if (value) {
            const jwtOb = { email, name }
            if (role) {
                jwtOb.role = role
            }
            const token = jwt.signJwt(jwtOb)
            response.handlerResponse(res, { message: 'authorized', token, status: 200 })
        } else {
            return Promise.reject(new HandlerError('not authorized', 401))
        }
    })
    .catch(e => {
        if (e instanceof HandlerError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerResponse(res, { message: 'error server', status: 500 })
            logger.error(` error to authenticate user ${e} `)
        }
    })
}

module.exports = {
    authenticate
}