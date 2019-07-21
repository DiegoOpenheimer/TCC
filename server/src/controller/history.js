const History = require('../model/history')
const response = require('./handlerResponse')
const moment = require('moment')

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime()
}

module.exports = {
    getHistories(req, res) {
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const queryField = req.query.field
        let query = {}
        const date = new Date(queryField)
        let filter
        if (queryField) {
            const regexField = new RegExp(queryField, "gi")
            if (!date.isValid()) {
                filter = [ { email: { $regex: regexField } }, { reason: { $regex: regexField } }]
            } else {
                filter = [ { email: { $regex: regexField } }, { reason: { $regex: regexField } }, { createdAt: { $gte: moment.utc(date).toDate(), $lte: moment.utc(date).endOf('day').toDate() } } ]
            }
            query = {
                $or: filter
            }
        }
        History.paginate(query, { sort: { createdAt: -1 }, page: Number(page), limit: Number(limit) })
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, 'error to get histories ' + e))
    }
}