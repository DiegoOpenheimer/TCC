const Line = require('../model/lines')
const Score = require('../model/score')
const response = require('./handlerResponse')
const HandleError = require('./handlerError')
const jwt = require('../utils/jwt')
const { History } = response

function getLines(req, res) {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const queryField = req.query.field
    let query = {}
    if (queryField) {
        const regexField = new RegExp(queryField, "gi")
        query = {
            $or: [ { description: { $regex: regexField } } ]
        }
        if (!isNaN(Number(queryField))) {
            query.$or.push({ number: queryField })
        }
    }
    Line.paginate(query, { page: Number(page), limit: Number(limit), select: '-score -directions -points -routes' })
    .then(result => response.handlerResponse(res, result))
    .catch(e => response.handlerUnexpectError(res, 'error to get lines ' + e))
}

function getLineById(req, res) {
    const id = req.params.id
    if (!id) {
        response.handlerResponse(res, { message: 'Not found', status: 404 })
    } else {
        Line.findById(id)
        .select(['-score'])
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, `Error to get line by id ${e}`))
    }
}

async function editLine(req, res) {
    const line = req.body
    try {
        const lineFound = await Line.findById(line._id)
        if (lineFound) {
            if (lineFound.number !== line.number) {
                const findLineWithNumber = await Line.find({ number: line.number })
                if (findLineWithNumber.length) {
                    throw new HandleError('Entity used', 409)
                }
            }
            lineFound.number = line.number
            lineFound.description = line.description
            lineFound.routes = line.routes
            lineFound.directions = line.directions
            lineFound.points = line.points
            lineFound.horary = line.horary
            await lineFound.save()
            response.handlerResponse(res, { message: 'Line edited' })
        } else {
            throw new HandleError('Not found', 404)
        }
    } catch (e) {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to edit line ${e}`)
        }
    }
}

async function createLine(req, res) {
    const line = req.body
    try {
        const findLineWithNumber = await Line.find({ number: line.number })
        if (findLineWithNumber.length) {
            throw new HandleError('Entity used', 409)
        } else {
            await Line.create(line)
            response.handlerResponse(res, { message: 'Line created' })
        }
    } catch (e) {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to edit line ${e}`)
        }
    }
}

function removeLine(req, res) {
    const { id } = req.params
    const { email } = jwt.decode(req.headers.authorization)
    let lineNumber
    Line.findById(id)
    .then(line => {
        if (line) {
            lineNumber = line.number
            return line.remove()
        } else {
            return Promise.reject(new HandleError('Not found', 404))
        }
    })
    .then(_ => response.handlerResponse(
        res,
        { message: 'line removed' },
        new History(`Usuário com email ${email} removeu a linha número ${lineNumber}`, email)    
    ))
    .catch(e => {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to remove line ${e}`)
        }
    })
}

function getLinesToAssociate(_, res) {
    Line.find().select(['-routes', '-directions', '-points', '-__v', '-createdAt', '-updatedAt', '-score'])
    .then(result => response.handlerResponse(res, result))
    .catch(e => response.handlerUnexpectError(`Fail to get lines to associate ${e}`))
}

function lineAmount(_, res) {
    Line.countDocuments()
    .then(count => response.handlerResponse(res, { count }))
    .catch(e => response.handlerUnexpectError(res, `Fail to get lines amount ${e}`))
}

function getScoreLine(req, res) {
    const filter = req.query.filter
    if (filter) {
        if (filter === 'all') {
            Score.find()
            .select('star')
            .then(scores => {
                if (scores.length) {
                    const result = scores.reduce((a, b) => {
                        a[ b.star - 1 ] = a[ b.star - 1 ] + 1
                        return a
                    }, [ 0, 0, 0, 0, 0 ])
                    response.handlerResponse(res, result)
                } else {
                    response.handlerResponse(res, [])
                }
            })
            .catch(e => response.handlerUnexpectError(res, `Error to get score ${e}`))
        } else {
            Score.find({ line: filter })
            .select('star')
            .then(scores => {
                if (scores.length) {
                    const result = scores.reduce((a, b) => {
                        a[ b.star - 1 ] = a[ b.star - 1 ] + 1
                        return a
                    }, [ 0, 0, 0, 0, 0 ])
                    response.handlerResponse(res, result)
                } else {
                    response.handlerResponse(res, [])
                }
            })
            .catch(e => {
                if (e instanceof HandleError) {
                    response.handlerResponse(res, e)
                } else {
                    response.handlerUnexpectError(res, `Error to get score ${e}`)
                }
            })
        }
    } else {
        response.handlerResponse(res, [])
    }
}

function getScore(req, res) {
    const { id } = req.params
    const { page = 1, limit = 10, star = 5 } = req.query
    if (id) {
        let query = { $and: [{ line: id }, { star }] }
        Score.paginate(query, { sort: { createdAt: -1 }, page: Number(page), limit: Number(limit), populate: [
            { path: 'user', select: 'name' },
            { path: 'line', select: 'description number' }
        ],})
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, `Error to get score ${e}`))
    } else {
        response.handlerResponse(res, new HandleError('Missed id', 409))
    }
}

module.exports = { getLines, getLineById, editLine, removeLine, createLine, getLinesToAssociate, lineAmount, getScoreLine, getScore }