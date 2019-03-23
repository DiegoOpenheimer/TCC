const winston = require('winston')

const { combine, timestamp, printf } = winston.format

const mFormat = printf(({ message, timestamp }) => {
    const log = {
      timestamp,
      message
    }
    return JSON.stringify(log)
})

const logger = winston.createLogger({
    level: 'info',
    format: combine(
      winston.format.json(),
      timestamp(),
      mFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/debug.log' })
    ]
});

module.exports = logger