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

      if (res.statusCode === 429) {
        // console.log(res.headers['retry-after'])
        const error = {
          msg: new Error(`Making pause: ${res.statusCode}`),
          status: res.statusCode,
          resetTime: res.headers['retry-after']
        }
        reject(error)
      }

      if (res.statusCode < 200 || res.statusCode > 299) {
        // console.log(res.headers['retry-after'])
        reject(new Error(`Failed to make request: ${res.statusCode}`))
      }

      resolve({ body: camelCasedBody, status: res.statusCode, headers: res.headers })
    })
  })
}

module.exports = callApi
