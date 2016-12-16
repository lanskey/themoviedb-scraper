module.exports = function (url, cb) {
  request(url, (err, res, body) => {
    !err ? cb(null, JSON.parse(body)) : cb(err)
  })
}
