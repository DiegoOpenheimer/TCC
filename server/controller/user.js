const User  = require('../model/user')
const logger = require('../utils/logger')
const response = require('./handlerResponse')
const HandlerError = require('./handlerError')
const emailService = require('../utils/senderEmail')
const jwt = require('../utils/jwt')
const html = require('../views/pagesHtml')
const constants = require('../utils/constants')
const {JsonWebTokenError} = require('jsonwebtoken')

// create user, if user already exist, a new email is sent to user to enabled account
const createUser = (req, res) => {
    const user = req.body
    User.findOne({ email: user.email })
    .then(userFound => {
        if(userFound && userFound.status === constants.USER_STATUS.ENABLED) {
            return Promise.reject(new HandlerError('user already registered', 409))
        } else if(!userFound) {
            return User.create(user)
        }
    })
    .then(_ => {
        const token = jwt.signJwt({ email: user.email }, { expiresIn: '1d' })
        const link = 'http://' + process.env.URI + ':' + process.env.PORT + '/user' + '/' + token
        emailService.sender(user.email, 'Confirmação de conta', html.confirmAccount(link))
        response.handlerResponse(res, { message: 'user registered', status: 200})
    })
    .catch(e => {
        if (e instanceof HandlerError) {
            response.handlerResponse(res, e)
        } else {
            handlerUnexpectError(res, `error find one user ${e}`)
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
            handlerUnexpectError(res, `fail to enable account ${e}`)
        }
    })
}

const renderPageToChangePassword = (req, res) => {
    let email
    const token = req.params.id
    jwt.verifyJwt(token)
    .then(result => {
        email = result.email
        return User.findOne({ email })
    })
    .then(user => {
        if (user) {
            res.render('recoverPassword')
        } else {
            return Promise.reject(new HandlerError('user not found', 404))
        }
    })
    .catch(e => {
        if (e instanceof HandlerError) {
            response.handlerResponse(res, e)
        } else if (e instanceof JsonWebTokenError) {
            response.handlerResponse(res, new HandlerError('invalid token', 401))
        } else {
            handlerUnexpectError(res, `fail to render page to change password ${e}`)
        }
    })
}

const recoverPassword = (req, res) => {
    const email = req.body.email
    User.findOne({email})
    .then(user => {
        if (user && user.status === constants.USER_STATUS.ENABLED) {
            const token = jwt.signJwt({ email }, { expiresIn: '1d' })
            const link = 'http://' + process.env.URI + ':' + process.env.PORT + '/user' + '/recover-password/' + token
            emailService.sender(email, 'Troca de senha', html.confirmChangePassword(link))
            response.handlerResponse(res, { message: 'email sent to user', status: 200 })
        } else {
            return Promise.reject(new HandlerError('user not found', 404))
        }
    })
    .catch(e => {
        if (e instanceof HandlerError) {
            response.handlerResponse(res, e)
        } else {
            handlerUnexpectError(res, `error to request to recover password ${e}`)
        }
    })
}

const changePassword = (req, res) => {
    const token = req.headers.authorization
    const password = req.body.password
    const tokenDecode = jwt.decode(token)
    if (tokenDecode.email) {
        User.findOne({email:tokenDecode.email})
        .then(user => {
            if (user) {
                user.password = password
                return user.save()
            } else {
                return Promise.reject(new HandlerError('user not found', 404))
            }
        })
        .then(_ => response.handlerResponse(res, { message: 'password changed', status: 200 }))
        .catch(e => {
            handlerUnexpectError(res, `fail to change password ${e}`)
        })
    } else {
        response.handlerResponse(res, new HandlerError('user not found', 404))
    }
}


const handlerUnexpectError = (res, message) => {
    response.handlerResponse(res, { message: 'Unexpected error', status: 500 })
    logger.error(message)
}


module.exports = {
    createUser,
    enableAccount,
    recoverPassword,
    changePassword,
    renderPageToChangePassword
}