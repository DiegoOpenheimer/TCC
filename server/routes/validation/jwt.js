const jwt = require('../../utils/jwt')
const { JsonWebTokenError } = require('jsonwebtoken')

const handlerJwt = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(401).send({ message: 'not authorized' })
    } else {
        jwt.verifyJwt(token).then(_ => {
            next()
        })
        .catch(e => {
            if (e instanceof JsonWebTokenError) {
                res.status(401).send({ message: 'not authorized' })
            } else {
                res.status(500).send({ message: 'error server' })
            }
        })
    }
}

module.exports = handlerJwt