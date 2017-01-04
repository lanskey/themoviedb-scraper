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
  const { options: { limit } } = this
  const stream = new EventEmitter()

  stream.on('get', () => {
    stream.emit('data', {data: 'test'})
  })

  if (_.isNumber(limit)) {
    let counter = 0
    stream.on('data', () => {
      counter += 1
      if (counter === limit) {
        stream.emit('end')
      } else {
        stream.emit('get')
      }
    })
  }

  return stream
}

module.exports = DataStream
