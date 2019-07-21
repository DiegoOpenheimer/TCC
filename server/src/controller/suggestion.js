const Suggestion = require('../model/suggestion')
const response = require('./handlerResponse')
const moment = require('moment')

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
        Suggestion.paginate(query, { sort: { createdAt: -1 }, page: Number(page), limit: Number(limit), populate: { path: 'messages.by', select: '-password -status -_id -createdAt -updatedAt' } })
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, 'error to get histories ' + e))
    },

    registerSuggestion(req, res) {
        const suggestion = req.body
        Suggestion.create(suggestion)
        .then(_ => response.handlerResponse(res, 'Suggestion added'))
        .catch(e => response.handlerUnexpectError(`fail to add suggestion ${e}`))
    },

    removeSuggestion(req, res) {
        const {id} = req.body
        Suggestion.findByIdAndDelete(id)
        .then(_ => response.handlerResponse(res, 'Suggestion removed'))
        .catch(e => response.handlerUnexpectError(res, `error to remove suggestion ${e}`))
    },

    addMessage(req, res) {
        const { message, id } = req.body
        Suggestion.findById(id)
        .then(suggestion => {
            if (suggestion) {
                suggestion.messages.push(message)
                return suggestion.save()
            } else {
                response.handlerResponse(res, { message: 'Suggestion no found', status: 404 })
            }
        })
        .then(_ => response.handlerResponse(res, 'Message added'))
        .catch(e => response.handlerUnexpectError(res, `fail to add message ${e}`))
    }
}