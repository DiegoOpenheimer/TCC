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

// model.find()
// .populate({ path: 'messages.by', select: '-password' })
// .then(r => console.log(JSON.stringify(r, null, 1)))
// model.create({
//     autor: '5c956b45f6b2d80c24751172',
//     title: 'Help me',
//     messages: [
//         {
//             message: 'nice to meet you',
//             by: '5c956b45f6b2d80c24751172'
//         }
//     ],
//     onModel: 'User'
// })