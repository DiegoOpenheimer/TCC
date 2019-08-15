const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema


const newsSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Employee' },
    title: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true })

newsSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('News', newsSchema)