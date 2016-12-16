const callApi = require('./services/callApi')

function runtime () {
  const url = 'http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5'
  const data = callApi(url)
    .catch(err => console.error(err))
    .then((onReject, onResolve) => {
      console.log(onResolve)
    })
}

module.exports = runtime
