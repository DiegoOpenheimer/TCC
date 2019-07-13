const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const constants = require('../utils/constants')

const Schema = mongoose.Schema

const employeeSchema = new Schema({
    name: String,
    email: String,
    password: String,
    cpf: String,
    role: {
        type: String,
        enum: [constants.EMPLOYEE_ROLE.ADMIN, constants.EMPLOYEE_ROLE.COMMON],
        default: constants.EMPLOYEE_ROLE.COMMON
    },
    status: {
        type: String,
        enum: [constants.USER_STATUS.ENABLED, constants.USER_STATUS.PENDING],
        default: constants.USER_STATUS.PENDING
    }
})

employeeSchema.pre('save', function(next) {
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

employeeSchema.methods.checkPassword = function(password) {
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

const Employee = mongoose.model('Employee', employeeSchema)



module.exports = Employee