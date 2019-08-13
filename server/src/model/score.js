const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    line: { type: Schema.Types.ObjectId, ref: 'Lines' },
    description: String,
    star: Number
}, { timestamps: true })

ScoreSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Score', ScoreSchema)