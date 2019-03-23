const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const constants = require('../utils/constants')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    status: {
        type: String,
        enum: [constants.USER_STATUS.ENABLED, constants.USER_STATUS.PENDING],
        default: constants.USER_STATUS.PENDING
    }
})

userSchema.pre('save', function(next) {
    user = this
    if (!user.isModified) {
        next()
    }
    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })
})

userSchema.methods.checkPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isSame) => {
            if (err) {
                reject(err)
            } else {
                resolve(isSame)
            }
        })
    })
}

const User = mongoose.model('User', userSchema)



module.exports = User