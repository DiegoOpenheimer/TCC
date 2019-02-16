const User  = require('../model/user')
const logger = require('../utils/logger')
const response = require('./handlerResponse')
const HandlerError = require('./handlerError')
const email = require('../utils/senderEmail')
const jwt = require('../utils/jwt')
const html = require('../utils/pagesHtml')
const constants = require('../utils/constants')

const createUser = (req, res) => {
    const user = req.body
    User.findOne({ email: user.email })
    .then(userFound => {
        if(userFound) {
            return Promise.reject(new HandlerError('user already registered', 409))
        } else {
            return User.create(user)
        }
    })
    .then(_ => {
        const token = jwt.signJwt({ email: user.email }, { expiresIn: '1d' })
        const link = 'http://' + process.env.URI + ':' + process.env.PORT + '/user' + '/' + token
        email.sender(user.email, 'Confirmação de conta', html.confirmAccount(link))
        response.handlerResponse(res, { message: 'user registered', status: 200 })
    })
    .catch(e => {
        if (e instanceof HandlerError) {
            response.handlerResponse(res, e)
        } else {
            res.status(500).send({ message: 'error server' })
            logger.error(`error find one user ${e}`)
        }
    })
}

const enableAccount = (req, res) => {
    jwt.verifyJwt(req.params.id)
    .then(result => User.findOneAndUpdate({ email: result.email }, { status: constants.USER_STATUS.ENABLED }))
    .then(_ => response.handlerResponse(res, { message: 'user enabled', status: 200 }))
    .catch(e => {
        if (e instanceof JsonWebTokenError) {
            response.handlerResponse(res, { message: 'invalid token', status: 401 })
        } else {
            response.handlerResponse(res, { message: 'error server', status: 500 })
            logger.error(`FAIL TO ENABLE ACCOUNT ${e}`)
        }
    })
}


module.exports = {
    createUser,
    enableAccount
}