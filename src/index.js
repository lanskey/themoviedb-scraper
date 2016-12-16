// https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/ - project structure
// https://blog.risingstack.com/node-js-best-practices-part-2/
// https://www.quora.com/Node-js-Whats-the-best-practice-for-structuring-models-with-mongoose - mongoose best practice
// https://www.codementor.io/mattgoldspink/tutorials/nodejs-best-practices-du1086jja - just node best pracice
// TODO: Add logger, helper for handling errors, helmet, monitoring tool
const request = require('request')

const callForMovies = function (url, cb) {
  request(url, (err, res, body) => {
    if (!err) {
      const test = JSON.parse(body)
      cb(null, test.results)
    } else {
      cb(err)
    }
  })
  // request
  //   .get(url)
  //   .end((err, res) => {
  //     if (!err) {
  //       const { results } = res.body
  //       cb(null, results)
  //     } else {
  //       cb(err)
  //     }
  //   })
}

module.exports = {
  callForMovies
}
