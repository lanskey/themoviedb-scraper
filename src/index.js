const callApi = require('./services/callApi')

function runtime () {
  console.log('runtime has begin')
  const url = 'http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5'
  callApi(url)
    .then(({ results }) => {
      console.log(results.length)
      return results
    })
}

module.exports = runtime
