const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Device = require('./device')

const Schema = mongoose.Schema

const RouteSchema = new Schema({
    route: String
})

const PointSchema = new Schema({
    name: String,
    lng: Number,
    lat: Number
})

const HorarySchema = new Schema({
    mondayToSaturday: [String],
    sundayAndHoliday: [String]
})

const LineSchema = new Schema({
    number: { type: Number, unique: true },
    description: String,
    routes: [RouteSchema],
    directions: Object,
    horary: HorarySchema,
    points: [PointSchema],
}, { timestamps: true })

LineSchema.plugin(mongoosePaginate)

LineSchema.pre('save', function(next) {
    if (this.isModified('number') || this.isModified('description')) {
        Device.find({ line: { _id: this._id } })
        .then(devices => {
            if (devices) {
                devices.forEach(device => {
                    device.lineNumber = this.number
                    device.lineDescription = this.description
                    device.save()
                })
            }
        })
    }
    next()
})

LineSchema.pre('remove', function(next) {
    Device.find({ line: { _id: this._id } })
    .then(devices => {
        if (devices) {
            devices.forEach(device => {
                device.line = ''
                device.lineNumber = null
                device.lineDescription = ''
                device.save()
            })
        }
    })
    next()
})

module.exports = mongoose.model('Lines', LineSchema)
