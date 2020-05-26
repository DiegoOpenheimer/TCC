const winston = require('winston')
require('winston-daily-rotate-file');

const { combine, timestamp, printf } = winston.format

const transport = new (winston.transports.DailyRotateFile)({
  dirname: 'logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

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
      new winston.transports.File({ filename: 'logs/debug.log' }),
      transport
    ]
});

module.exports = logger