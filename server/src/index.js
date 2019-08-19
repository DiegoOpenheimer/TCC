require('dotenv').load()
const logger = require('./utils/logger')
const app = require('./app')
const mongoose = require('./config/mongoose')
const mqtt = require('./services/mqtt')
const PORT = process.env.PORT
mongoose.connectMongoDb()
.then(() => {
    app.listen(PORT, err => {
        if (err) {
            logger.error(` error to initialize ${err} `)
        } else {
            console.log(`server listen on port ${PORT}`)
            mqtt()
            mongoose.listenOnError()
        }
    })
})
.catch(e => logger.error(`FAIL TO CONNECT MONGODB ${e}`))
