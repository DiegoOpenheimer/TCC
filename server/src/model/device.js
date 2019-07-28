const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema


const deviceSchema = new Schema({
    uuid: { type: String, unique: true },
    longitude: Number,
    latitude: Number,
    line: { type: Schema.Types.ObjectId, ref: 'Lines' },
    lineDescription: String,
    lineNumber: Number
}, { timestamps: true })

deviceSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Devices', deviceSchema)