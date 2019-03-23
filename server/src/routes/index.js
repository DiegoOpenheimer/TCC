const router = require('express').Router()
const useRouter = require('./user')
const authRouter = require('./auth')

router.use('/user', useRouter)
router.use('/auth', authRouter)
router.use('*', (req, res) => {
    res.status(404).render('html404')
})

module.exports = router
