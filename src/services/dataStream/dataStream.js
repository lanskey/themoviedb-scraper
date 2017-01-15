const _ = require('lodash')
const callApi = require('src/services/callApi')
const EventEmitter = require('events').EventEmitter
const URL = require('url-parse')

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
    endPoint: '/discover/movie'
  }, options)

  this.isDelayed = false
  this.currentPage = 1
  this.lastPage = null
}

DataStream.prototype._prepareUrl = function () {
  const { baseUrl, endPoint } = this.options
  // it should get baseUrl, endPoint, apiKey and create single url from it
  // it should extend this url using custom uri params, like: page or with_genres
  this.url = URL(`${baseUrl}${endPoint}`)
  this.route = this.url.href
  this._prepareQuery()

  return this
}

DataStream.prototype._prepareQuery = function () {
  const { apiKey } = this.options
  this.query = { 'api_key': apiKey }
  this._updateQuery()

  return this
}

DataStream.prototype._removeFromQuery = function (what) {
  this.query = _.omit(this.query, what)
  this._updateQuery()

  return this
}

DataStream.prototype._addToQuery = function (what) {
  this.query = _.assign(this.query, what)
  this._updateQuery()

  return this
}

DataStream.prototype._updateQuery = function () {
  this.url.set('query', this.query)

  return this
}

/**
 * @method stream
 * @desc Creates instance of EventEmitter and attaches custom listeners
 */
DataStream.prototype.stream = function () {
  const { options: { limit } } = this
  const stream = new EventEmitter()

  stream.on('get', () => {
    // if (this.lastPage === null) {
    //   // get last page
    //   this._lastPage()
    //   return
    // }
    this._prepareUrl()
    this._requestUrl(stream, this.route)
  })

  // if (_.isNumber(limit) || limit === 'MAX') {
  //   this._reachCallLimit(stream)
  // }

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
    console.log('should make request')
    callApi(url)
      .catch((error) => {
        console.log('Error?')
        if (error.status === 429) {
          this._delayRequest(stream, error.resetTime)
        } else {
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
      }, 1500)
    })
}

module.exports = DataStream
