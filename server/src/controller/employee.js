const Employee = require('../model/employee')
const response = require('./handlerResponse')
const HandleError = require('./handlerError')
const constants = require('../utils/constants')
const jwt = require('../utils/jwt')
const emailService = require('../utils/senderEmail')
const {JsonWebTokenError} = require('jsonwebtoken')
const html = require('../views/pagesHtml')

const createEmployee = (req, res) => {
    const employee = req.body
    Employee.findOne({ email: employee.email })
    .then(user => {
        if (user && user.status === constants.USER_STATUS.ENABLED) {
            return Promise.reject(new HandleError('user employee registed', 409))
        } else if (!user) {
            return Employee.create(employee)
        }
    })
    .then(_ => {
        const token = jwt.signJwt({ email: employee.email }, { expiresIn: '1d' })
        const link = 'http://' + process.env.URI + ':' + process.env.PORT + '/employee' + '/' + token
        emailService.sender(employee.email, 'Confirmação de conta', html.confirmAccount(link))
        response.handlerResponse(res, { message: 'employee registered', status: 200})
    })
    .catch(e => {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, 'error to create employee ' + e)
        }
    })

}

const enableAccount = (req, res) => {
    jwt.verifyJwt(req.params.id)
    .then(result => Employee.findOneAndUpdate({ email: result.email }, { status: constants.USER_STATUS.NOT_AUTHORIZED }))
    .then(_ => response.handlerResponse(res, { message: 'Account confirmed', status: 200 }))
    .catch(e => {
        if (e instanceof JsonWebTokenError) {
            response.handlerResponse(res, { message: 'invalid token', status: 401 })
        } else {
            response.handlerUnexpectError(res, `fail to enable account ${e}`)
        }
    })
}

const recoverPassword = (req, res) => {
    const email = req.body.email
    Employee.findOne({email})
    .then(user => {
        if (user && user.status === constants.USER_STATUS.ENABLED) {
            const token = jwt.signJwt({ email }, { expiresIn: '1d' })
            const link = 'http://' + process.env.URI + ':' + process.env.PORT + '/employee' + '/recover-password/' + token
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
            response.handlerUnexpectError(res, `error to request to recover password ${e}`)
        }
    })
}

const changePassword = (req, res) => {
    const token = req.headers.authorization
    const password = req.body.password
    const tokenDecode = jwt.decode(token)
    if (tokenDecode.email) {
        Employee.findOne({email:tokenDecode.email})
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
            response.handlerUnexpectError(res, `fail to change password ${e}`)
        })
    } else {
        response.handlerResponse(res, new HandlerError('user not found', 404))
    }
}

const renderPageToChangePassword = (req, res) => {
    let email
    const token = req.params.id
    jwt.verifyJwt(token)
    .then(result => {
        email = result.email
        return Employee.findOne({ email })
    })
    .then(user => {
        if (user) {
            res.render('recoverPassword', { entity: 'employee' })
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
            response.handlerUnexpectError(res, `fail to render page to change password ${e}`)
        }
    })
}



module.exports = {
    createEmployee,
    enableAccount,
    recoverPassword,
    changePassword,
    renderPageToChangePassword
}