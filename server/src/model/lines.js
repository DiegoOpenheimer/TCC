const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Schema = mongoose.Schema

const RouteSchema = new Schema({
    route: String
})

const LineSchema = new Schema({
    number: { type: Number, unique: true },
    description: String,
    routes: [RouteSchema],
    directions: Object
})

LineSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Lines', LineSchema)
