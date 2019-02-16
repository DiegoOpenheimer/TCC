const router = require('express').Router()
const useRouter = require('./user')
const authRouter = require('./auth')
const {html404} = require('../utils/pagesHtml')

router.use('/user', useRouter)
router.use('/auth', authRouter)
router.use('*', (req, res) => {
    res.status(404).send(html404)
})

module.exports = router
