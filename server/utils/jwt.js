const jwt = require('jsonwebtoken')
const secretKey = 'tcc-bus'

const signJwt = data => {
    return jwt.sign(data, new Buffer.from(secretKey, 'base64'))
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

const token = signJwt({name: 'diego'})
console.log(token)
verifyJwt(token)

module.exports = {
    signJwt,
    verifyJwt
}
