const Device = require('../model/device')
const Line = require('../model/lines')
const response = require('./handlerResponse')
const HandleError = require('./handlerError')
const jwt = require('../utils/jwt')
const { History } = response

function getDevices(req, res) {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const queryField = req.query.field
    let query = {}
    if (queryField) {
        const regexField = new RegExp(queryField, "gi")
        query = {
            $or: [ { uuid: { $regex: regexField } }, { 'lineDescription': { $regex: regexField } } ]
        }
        if (!isNaN(Number(queryField))) {
            query.$or.push({ 'lineNumber': queryField })
        }
    }
    Device.paginate(query, { page: Number(page), limit: Number(limit), populate: 'line' })
    .then(result => response.handlerResponse(res, result))
    .catch(e => response.handlerUnexpectError(res, 'error to get devices ' + e))
}

function getDeviceById(req, res) {
    const id = req.params.id
    if (!id) {
        response.handlerResponse(res, { message: 'Not found', status: 404 })
    } else {
        Device.findById(id)
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, `Error to get device by id ${e}`))
    }
}

async function editDevice(req, res) {
    const device = req.body
    try {
        await Device.findByIdAndUpdate(device._id, device)
        response.handlerResponse(res, { message: 'Device edited' })
    } catch (e) {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to edit device ${e}`)
        }
    }
}

async function createDevice(req, res) {
    const device = req.body
    try {
        const deviceCreated = await Device.create(device)
        const line = await Line.findById(device.line)
        deviceCreated.lineNumber = line.number
        deviceCreated.lineDescription = line.description
        await deviceCreated.save()
        response.handlerResponse(res, { message: 'Device created' })
    } catch (e) {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to edit device ${e}`)
        }
    }
}

function removeDevice(req, res) {
    const { id } = req.params
    const { email } = jwt.decode(req.headers.authorization).email
    let uuid
    Device.findById(id)
    .then(device => {
        if (device) {
            uuid = device.uuid
            return device.remove()
        } else {
            return Promise.reject(new HandleError('Not found', 404))
        }
    })
    .then(_ => response.handlerResponse(
        res,
        { message: 'device removed' },
        new History(`Usuário com email ${email} removeu o dispositivo número ${uuid}`, email)    
    ))
    .catch(e => {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to remove device ${e}`)
        }
    })
}

module.exports = { getDevices, getDeviceById, editDevice, removeDevice, createDevice }