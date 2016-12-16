const request = require('request')

const callForMovies = function (url, cb) {
  request(url, (err, res, body) => {
    !err ? cb(null, JSON.parse(body)) : cb(err)
  })
}

module.exports = {
  callForMovies
}
