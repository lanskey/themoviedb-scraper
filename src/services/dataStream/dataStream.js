const _ = require('lodash')
const moment = require('moment')
const callApi = require('src/services/callApi')
const EventEmitter = require('events').EventEmitter

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
}

/**
 * @method stream
 * @desc Creates instance of EventEmitter and attaches custom listeners
 */
DataStream.prototype.stream = function () {
  const { options: { limit } } = this
  const stream = new EventEmitter()

  stream.on('get', () => {
    this._requestUrl(stream, this.options.url)
  })

  if (_.isNumber(limit)) {
    this._reachCallLimit(stream)
  }

  this.streamInstance = stream
  return this.streamInstance
}

DataStream.prototype._reachCallLimit = function (stream) {
  const { options: { limit } } = this

  let counter = 0
  stream.on('data', () => {
    counter += 1
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
        console.log('Dane?')
        stream.emit('data', data)
      })
  }

  return this
}

DataStream.prototype._delayRequest = function (stream, time) {
  console.log('Delay?')
  console.log('pause for', time,  's')
  this.isDelayed = true

  setTimeout(() => {
    this.isDelayed = false
    stream.emit('get')
  }, time * 1000)

  return this
}

module.exports = DataStream
