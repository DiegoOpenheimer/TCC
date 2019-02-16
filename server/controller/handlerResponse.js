const handlerResponse = (res, payload) => {
    const message = payload.message || { message: 'ok' }
    const status = payload ? payload.status || 200 : 200
    res.status(status).send({ message })
}


module.exports = {
    handlerResponse,
}