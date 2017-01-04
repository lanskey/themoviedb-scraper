const EventEmitter = require('events').EventEmitter
const _ = require('lodash')

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
  const stream = new EventEmitter()

  stream.on('get', () => {
    stream.emit('data', {data: 'test'})
  })

  return stream
}

module.exports = DataStream
