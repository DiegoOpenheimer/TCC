const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user:'astrasoftware2018@gmail.com',
        pass:'Astra@123'
    }
})
const logger = require('../utils/logger')

const getMailOptions = (email, subject,html) => {
    return {
        from: 'astrasoftware2018@gmail.com',
        to: email,
        subject,
        html 
    }
}

const callback = (email, subject) => (err, info) => {
    if (err) {
        logger.error(`error to send email ${err}`)
    } else {
        logger.info(`email sent to ${email} with subject ${subject}`)
    }
}

const sender = (email, subject,html) => {
    transporter.sendMail(getMailOptions(email, subject, html), callback(email, subject))
}

module.exports = {
    sender
}