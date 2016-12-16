const request = require('request')
const logger = require('utils/helpers')

function callApi (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err) {
        logger.info('request made')
        resolve(null, JSON.parse(body))
      } else {
        reject(err)
      }
    })
  })
}

module.exports = callApi