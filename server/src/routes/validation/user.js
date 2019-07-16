const handlerCreateUser = (req, res, next) => {
    if (!req.body || !(req.body.email && req.body.password && req.body.name)) {
        badRequest(res)
    } else {
        next()
    }
}

const handleField = (...params) => (req, res, next) => {
    for (const param of params) {
        if (!req.body || !req.body[param]) {
            badRequest(res)
            return
        }
    }
    next()
}

const validationId = (req, res, next) => {
    if (!req.params.id) {
        badRequest(res)    
    } else {
        next()
    }
}

const badRequest = res => res.status(400).send({ message: 'missing values or type values are incorrects', status: 400 })

module.exports = {
    handlerCreateUser,
    handleField,
    validationId
}
