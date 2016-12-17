const winston = require('winston')
const moment = require('moment')

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'app-logs.log' })
  ]
})

const getDate = function () {
  return moment().format('DD MMM YYYY: HH:MM:SS')
}

module.exports = {
  logger,
  getDate
}
