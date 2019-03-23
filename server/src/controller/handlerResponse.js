const handlerResponse = (res, payload) => {
    const status = payload ? payload.status || 200 : 200
    res.status(status).send({ ...payload })
}


module.exports = {
    handlerResponse,
}