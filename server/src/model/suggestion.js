const mongoose = require('mongoose')
const moongoosePaginate = require('mongoose-paginate')

const Schema = mongoose.Schema

const Comment = new Schema({
    message: String,
    by: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'messages.onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['User', 'Employee']
    },
    createdAt: Date
})

const SuggestionSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    name: String,
    messages: [Comment],
}, {
    timestamps: true
})


SuggestionSchema.plugin(moongoosePaginate)

module.exports = mongoose.model('Suggestion', SuggestionSchema)
