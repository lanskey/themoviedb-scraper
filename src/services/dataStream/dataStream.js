const _ = require('lodash')
const callApi = require('src/services/callApi')
const EventEmitter = require('events').EventEmitter

function DataStream (options) {
  // allow us to create instance of DataStream constructor without 'new' keyword
  if (!(this instanceof DataStream)) { return new DataStream(options) }

  this.options = _.merge({
    apiKey: null,
    limit: null,
    url: 'http://api.themoviedb.org/3',
    endPoint: '/discover/movie'
  }, options)
}

DataStream.prototype.stream = function () {
  const { options: { limit } } = this
  const stream = new EventEmitter()

  stream.on('get', () => {
    const url = 'http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5'
    this._requestUrl(stream, url)
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
    counter === limit ? stream.emit('end') : setImmediate(() => stream.emit('get'))
  })

  return this
}

DataStream.prototype._requestUrl = function (stream, url) {
  callApi(url)
    .catch((error) => {
      console.error(new Error(`Failed to make request: ${error}`))
    })
    .then((data) => {
      stream.emit('data', data)
    })

  return this
}

module.exports = DataStream
