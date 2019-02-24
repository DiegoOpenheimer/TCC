const handlerCreateUser = (req, res, next) => {
    if (!req.body || !(req.body.email && req.body.password && req.body.name)) {
        badRequest()
    } else {
        next()
    }
}

const handlerRecoverPassword = param => (req, res, next) => {
    if (!req.body || !req.body[param]) {
        badRequest(res)
    } else {
        next()
    }
}

const validationId = (req, res, next) => {
    if (!req.params.id) {
        badRequest()    
    } else {
        next()
    }
}

const badRequest = res => res.status(400).send({ message: 'missing values or type values are incorrects', status: 400 })

module.exports = {
    handlerCreateUser,
    handlerRecoverPassword,
    validationId
}
