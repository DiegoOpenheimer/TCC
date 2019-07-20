const mongoose = require('mongoose')
const moongoosePaginate = require('mongoose-paginate')

const Schema = mongoose.Schema

const historySchema = new Schema({
    reason: String,
    email: String,
}, { timestamps: true })

historySchema.plugin(moongoosePaginate)

module.exports = mongoose.model('History', historySchema)
