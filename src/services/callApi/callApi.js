const request = require('request')
const camelcaseKeys = require('camelcase-keys')

function callApi (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        reject(new Error(err))
      }

      const parsedBody = JSON.parse(body)
      const camelCasedBody = camelcaseKeys(parsedBody)

      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Failed to make request: ${res.statusCode}`))
      }

      resolve({ body: camelCasedBody, status: res.statusCode, headers: res.headers })
    })
  })
}

module.exports = callApi
