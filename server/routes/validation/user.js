const handlerCreateUser = (req, res, next) => {
    if (!req.body || !(req.body.email && req.body.password && req.body.name)) {
        res.status(400).send({ message: 'missing invalids' })
    } else {
        next()
    }
}

const handlerConfirmAccount = (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'missing token' })
    } else {
        next()
    }
}

module.exports = {
    handlerCreateUser,
    handlerConfirmAccount
}
