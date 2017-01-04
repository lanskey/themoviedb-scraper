const EventEmitter = require('events').EventEmitter;
const _ = require('lodash')

// What this func should return?
// it should return stream, instance of eventEmitter
// it should console.log 'hello world' msg each time reciving 'display msg' event
//
function DataStream (options) {
  if (!(this instanceof DataStream)) { return new DataStream(options) }

  this.options = _createOptions(options)
}

function _createOptions (options) {
  const defaultOptions = {
    apiKey: null,
    limit: 3,
    url: 'http://api.themoviedb.org/3',
    endPoint: '/discover/movie'
  }

  return _.merge(defaultOptions, options)
}

DataStream.prototype.stream = function () {
  const stream = new EventEmitter()

  stream.on('display', () => {
    console.log('hello world')
  })

  return stream
}

module.exports = DataStream
