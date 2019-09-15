const Suggestion = require('../model/suggestion')
const response = require('./handlerResponse')
const HandleError = require('./handlerError')
const moment = require('moment')
const jwt = require('../utils/jwt')

const { History } = response

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime()
}

module.exports = {
    getSuggestions(req, res) {
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const queryField = req.query.field
        let query = {}
        const date = new Date(queryField)
        let filter
        if (queryField) {
            const regexField = new RegExp(queryField, "gi")
            if (!date.isValid()) {
                filter = [ { name: { $regex: regexField } }, { title : { $regex: regexField } }]
            } else {
                filter = [ { name: { $regex: regexField } }, { title: { $regex: regexField } }, { createdAt: { $gte: moment.utc(date).toDate(), $lte: moment.utc(date).endOf('day').toDate() } } ]
            }
            query = {
                $or: filter
            }
        }
        Suggestion.paginate(query, { sort: { createdAt: -1 }, page: Number(page), limit: Number(limit), populate: { path: 'messages.by' } })
        .then(result => {
            if (result && result.docs) {
                result.docs.forEach(doc => doc.messages.forEach(message => {
                    if (message && message.by) {
                        message.by.password = undefined
                        message.by.createdAt = undefined
                        message.by.updatedAt = undefined
                        message.by.status = undefined
                    }
                }))
            }
            response.handlerResponse(res, result)
        })
        .catch(e => response.handlerUnexpectError(res, 'error to get histories ' + e))
    },

    getSuggestionById(req, res) {
        Suggestion.findById(req.params.id)
        .populate('messages.by')
        .then(suggestion => {
            if (suggestion && suggestion.messages) {
                suggestion.messages.forEach(message => {
                    if (message && message.by) {
                        message.by.password = undefined
                        message.by.createdAt = undefined
                        message.by.updatedAt = undefined
                        message.by.status = undefined
                    }
                })
            }
            response.handlerResponse(res, suggestion || {})
        })
        .catch(e => response.handlerUnexpectError(res, `fail to get suggestion by id ${e}`))
    },

    registerSuggestion(req, res) {
        const suggestion = req.body
        Suggestion.create(suggestion)
        .then(_ => response.handlerResponse(res, 'Suggestion added'))
        .catch(e => response.handlerUnexpectError(res, `fail to add suggestion ${e}`))
    },

    removeSuggestion(req, res) {
        const {id} = req.body
        Suggestion.findByIdAndDelete(id)
        .then(_ => response.handlerResponse(res, 'Suggestion removed'))
        .catch(e => response.handlerUnexpectError(res, `error to remove suggestion ${e}`))
    },

    addMessage(req, res) {
        const { data, id } = req.body
        let nameUser
        let title
        const { email } = jwt.decode(req.headers.authorization)
        Suggestion.findById(id)
        .then(suggestion => {
            if (suggestion) {
                nameUser = suggestion.name
                title = suggestion.title
                data.createdAt = new Date()
                suggestion.messages.push(data)
                return suggestion.save()

            } else {
                return Promise.reject(new HandleError('Suggestion no found', 404))
            }
        })
        .then(_ => Suggestion.findById(id).populate('messages.by'))
        .then(value => {
            response.handlerResponse(
                res,
                value,
                new History(
                    `Usuário com email ${email},
                    respondeu uma discussão com o título de ${title} ao usuário ${nameUser},
                    com a seguinte mensagem: ${data.message}`,
                    email
                )
            )
        })
        .catch(e => {
            if (e instanceof HandleError) {
                response.handlerResponse(res, e)
            } else {
                response.handlerUnexpectError(res, `fail to add message ${e}`)
            }
        })
    },

    removeMessage(req, res) {
        const { suggestion, message } = req.body
        Suggestion.updateOne(
            { _id: suggestion },
            { $pull: { messages: { _id: message } } }
        )
        .then(_ => response.handlerResponse(res, { message: 'message removed' }))
        .catch(e => response.handlerUnexpectError(res, `fail to remove a message ${e}`))
    },

    getSuggestionByUser(req, res) {
        const jwtDecoced = jwt.decode(req.headers.authorization)
        Suggestion.find({ author: jwtDecoced._id })
        .sort({ createdAt: -1 })
        .populate('messages.by')
        .then(suggestions => {
            if (suggestions) {
                suggestions.forEach(suggestion => suggestion.messages.forEach(message => {
                    if (message && message.by) {
                        message.by.password = undefined
                        message.by.status = undefined
                        message.by.cpf = undefined
                        message.by.role = undefined
                    }
                }))
            }
            response.handlerResponse(res, suggestions)
        })
        .catch(e => response.handlerUnexpectError(res, `fail to get suggestion by user ${e}`))
    }
}