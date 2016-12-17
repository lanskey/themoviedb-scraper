const callApi = require('./services/callApi')
const { logger, getDate } = require('utils/helpers')

function runtime () {
  // TODO: run callApi multiple times under we reach some limit
  // TODO: validate X-RateLimit-Remaining header and if > 0, run another 'callApi', else wait appropriate amount of time returned by
  // X-RateLimit-Reset header
  // TODO: Prepare a .log file of downloaded movie titles
  // TODO: Attach custom uri keys to limit movies page limit, we should estimate parameters to met max of 1000 page per set(of filters)

  console.log('runtime has begin')
  const url = 'http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5'
  callApi(url)
    .then((res) => {
      logger.info(`${getDate()} API has been done, status: ${res.statusCode}`)
      console.log(res.results.length)
      return res
    })
}

module.exports = runtime
