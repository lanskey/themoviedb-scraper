// Klasa to logiczny zbior funkcji(metod) i danych (proporcji)
// klasa to "cos"

const events = require('events')
const eventEmitter = new events.EventEmitter()
const nodemon = require('nodemon')

const { logger, getDate } = require('utils/helpers')
const callApi = require('../callApi')

let counter = 0
const getMovies = function () {
  const url = 'http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5'

  return callApi(url)
    .then((data) => {
      logger.info(`${getDate()} API call has been done`)
      counter += 1
      // data.results.forEach(item => database.push(item))
      console.log(counter)
      if (counter === 3) {
        nodemon.emit('quit')
        process.exit()
      }
      eventEmitter.emit('getMoviesCompleted')
      return data
    })
    .catch(err => logger.error(err))
}

eventEmitter.on('getMoviesCompleted', getMovies)
eventEmitter.on('getMovies', getMovies)

module.exports = eventEmitter
