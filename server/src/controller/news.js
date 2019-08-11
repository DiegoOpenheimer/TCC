const News = require('../model/news')
const response = require('./handlerResponse')
const HandleError = require('./handlerError')
const jwt = require('../utils/jwt')
const { History } = response

async function getNews(req, res) {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const queryField = req.query.field
    let query = {}
    if (queryField) {
        const regexField = new RegExp(queryField, "gi")
        query = { $or: [{ message: { $regex: regexField } }, { title: { $regex: regexField } }] }
    }
    try {
        const result = await News.paginate(query, { page: Number(page), limit: Number(limit), populate: { path: 'author', select: 'name email' } })
        response.handlerResponse(res, result)
    } catch (error) {
        response.handlerUnexpectError(res, `error to get news ${error}`)
    }
}

function getNewsById(req, res) {
    const id = req.params.id
    if (!id) {
        response.handlerResponse(res, { message: 'Not found', status: 404 })
    } else {
        News.findById(id)
        .populate({ path: 'author', select: 'name email' })
        .then(result => response.handlerResponse(res, result))
        .catch(e => response.handlerUnexpectError(res, `Error to get news by id ${e}`))
    }
}

async function editNews(req, res) {
    const news = req.body
    try {
        await News.findByIdAndUpdate(news._id, news)
        response.handlerResponse(res, { message: 'Device edited' })
    } catch (e) {
        response.handlerUnexpectError(res, `Error to edit news ${e}`)
    }
}

async function createNews(req, res) {
    const news = req.body
    try {
        await News.create(news)
        response.handlerResponse(res, { message: 'News created' })
    } catch (e) {
        response.handlerUnexpectError(res, `Error to edit device ${e}`)
    }
}

function removeNews(req, res) {
    const { id } = req.params
    const { email } = jwt.decode(req.headers.authorization)
    let title
    News.findById(id)
    .then(news => {
        if (news) {
            title = news.title
            return news.remove()
        } else {
            return Promise.reject(new HandleError('Not found', 404))
        }
    })
    .then(_ => response.handlerResponse(
        res,
        { message: 'news removed' },
        new History(`Usuário com email ${email} removeu uma notícia com o título de ${title}`, email)    
    ))
    .catch(e => {
        if (e instanceof HandleError) {
            response.handlerResponse(res, e)
        } else {
            response.handlerUnexpectError(res, `Error to remove device ${e}`)
        }
    })
}

module.exports = { getNews, getNewsById, editNews, removeNews, createNews }