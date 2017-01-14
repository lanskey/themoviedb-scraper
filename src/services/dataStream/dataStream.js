const _ = require('lodash')
const callApi = require('src/services/callApi')
const EventEmitter = require('events').EventEmitter

const { genres } = require('src/constants/api')

/**
 * @class DataStream
 * @desc Streams movies from API using EventEmitter
 */
function DataStream (options) {
  // allow us to create instance of DataStream constructor without 'new' keyword
  if (!(this instanceof DataStream)) { return new DataStream(options) }

  this.options = _.merge({
    apiKey: '9dee05d48efe51f51b15cc63b1fee3f5',
    limit: null,
    baseUrl: 'http://api.themoviedb.org/3',
    endPoint: '/discover/movie',
    url: `http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5`
  }, options)

  this.isDelayed = false
  this.currentPage = 1
  this.lastPage = null
  this.currentUrl = this.options.url + `&with_genres=${genres[0]}`
}

/**
 * @method stream
 * @desc Creates instance of EventEmitter and attaches custom listeners
 */
DataStream.prototype.stream = function () {
  const { options: { limit } } = this
  const stream = new EventEmitter()

  stream.on('get', () => {
    if (this.lastPage === null) {
      // get last page
      this._lastPage()
      return
    }

    this._requestUrl(stream, `${this.options.url}&page=${this.currentPage}&with_genres=${genres[0]}&`)
  })

  if (_.isNumber(limit) || limit === 'MAX') {
    this._reachCallLimit(stream)
  }

  this.streamInstance = stream
  return this.streamInstance
}

DataStream.prototype._reachCallLimit = function (stream) {
  let counter = 0
  stream.on('data', () => {
    const limit = this.options.limit === 'MAX' ? this.lastPage : this.options.limit

    console.log(limit)
    counter += 1
    this.currentPage += 1
    counter >= limit ? stream.emit('end') : setImmediate(() => stream.emit('get'))
  })

  return this
}

/**
 * @method DataStream
 * @desc Calls API using callApi function, after done emits 'data' event with data object
*/
DataStream.prototype._requestUrl = function (stream, url) {
  if (!this.isDelayed) {
    callApi(url)
      .catch((error) => {
        console.log('Error?')
        if (error.status === 429) {
          this._delayRequest(stream, error.resetTime)
        } else {
          console.log(error)
          console.error(new Error(`Failed to make request: ${error}`))
        }
      })
      .then(data => {
        console.log('get data from page: ', this.currentPage)
        stream.emit('data', data)
      })
  }

  return this
}

DataStream.prototype._delayRequest = function (stream, time) {
  console.log('pause for', time, 's')
  this.isDelayed = true

  setTimeout(() => {
    this.isDelayed = false
    stream.emit('get')
  }, time * 1000)

  return this
}

DataStream.prototype._lastPage = function () {
  callApi(this.currentUrl + '&page=1000')
    .catch((error) => {
      if (error.status === 429) {
        this._delayRequest(this.streamInstance, error.resetTime)
      } else {
        console.log(error)
        console.error(new Error(`Failed to make request: ${error}`))
      }
    })
    .then(data => {
      console.log('Last page:', data.body.totalPages)

      this.lastPage = data.body.totalPages
      setTimeout(() => {
        console.log('resume request')
        this.streamInstance.emit('get')
      }, 2000)
    })
}

module.exports = DataStream
