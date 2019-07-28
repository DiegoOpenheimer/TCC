const router = require('express').Router()
const useRouter = require('./user')
const authRouter = require('./auth')
const employeeRouter = require('./employee')
const historyRouter = require('./history')
const suggestionRouter = require('./suggestion')
const lineRouter = require('./lines')
const deviceRouter = require('./device')

router.use('/user', useRouter)
router.use('/auth', authRouter)
router.use('/employee', employeeRouter)
router.use('/history', historyRouter)
router.use('/suggestion', suggestionRouter)
router.use('/line', lineRouter)
router.use('/device', deviceRouter)
router.use('*', (_, res) => res.status(404).render('html404'))

module.exports = router
