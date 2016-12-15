const winston = require('winston')

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'app-logs.log' })
  ]
})

module.exports = logger
