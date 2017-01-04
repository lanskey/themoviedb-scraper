const getMovies = require('./services/dataStream')
const getMoviesSecond = require('./services/dataStream')

function runtime () {
  // TODO: run callApi multiple times by the time we reach some limit
  // TODO: validate X-RateLimit-Remaining header and if > 0, run another 'callApi', else wait appropriate amount of time returned by
  // X-RateLimit-Reset header
  // TODO: Prepare a .log file which will contain downloaded movie titles
  // TODO: Attach custom uri keys to limit movies page limit, we should estimate parameters to met max of 1000 page per set(of filters)

  const instance = getMovies().stream()
  instance.emit('data')
}

module.exports = runtime
