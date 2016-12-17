const request = require('request')
const { logger, getDate } = require('utils/helpers')

function callApi (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        reject(new Error(err))
      }

      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Failed to make request`))
      }

      logger.info(`${getDate()} API request, status: ${res.statusCode}`)

      resolve(JSON.parse(body))
    })
  })
}

module.exports = callApi
