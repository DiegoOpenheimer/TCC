const validateFields = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: 'missing fields' })
    } else {
        next()
    }
}

module.exports = {
    validateFields
}