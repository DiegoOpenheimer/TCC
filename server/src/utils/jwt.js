const jwt = require('jsonwebtoken')
const secretKey = 'tcc-bus'

const signJwt = (data, options = null) => {
    return jwt.sign(data, new Buffer.from(secretKey, 'base64'), options)
}

const verifyJwt = token => {
    const key = new Buffer.from(secretKey, 'base64')
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}

const decode = token => jwt.decode(token)

module.exports = {
    signJwt,
    verifyJwt,
    decode
}