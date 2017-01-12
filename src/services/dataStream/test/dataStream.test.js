const DataStream = require('../dataStream')
const callApi = require('src/services/callApi')
const EventEmitter = require('events').EventEmitter
const { endpoint, baseUrl } = require('src/constants/api')

describe('DataStream', () => {
  describe('Constructor', () => {
    let defaults = {}
    beforeEach(() => {
      defaults = {
        apiKey: null,
        limit: null,
        url: 'http://api.themoviedb.org/3',
        endPoint: '/discover/movie'
      }
    })

    it('create factory instance', () => {
      const client = DataStream()
      expect(client).to.deep.eql(DataStream())
    })

    it('instance should have default options', () => {
      const client = DataStream()
      expect(client.options).to.be.eql(defaults)
    })

    it('instance should extend default options with custom options', () => {
      const newOptions = { apiKey: 'test' }
      const client = DataStream(newOptions)

      const result = Object.assign(defaults, newOptions)
      expect(client.options).to.be.eql(result)
    })
  })

  describe('Methods', () => {
    describe('stream', () => {
      // what i want achieve?
      // 1. it should emit 'data' event, when msg were displayed
      // 2. it should emit 'end' event, when limit were reached
      // 3. it should display messages until reach limit, if limit were specified
      let stream
      let client
      let limit
      beforeEach(() => {
        client = DataStream()
        stream = client.stream()

        nock(baseUrl)
          .get(endpoint)
          .query(true)
          .reply(200, { results: [ {} ] })
      })

      it('should have stream method, which is instance of eventEmitter', () => {
        expect(stream).to.be.instanceof(EventEmitter)
      })

      it('should emit "data" event, when data were received', (done) => {
        stream.on('data', (data) => {
          expect(data.results.length).to.eql(1)
          done()
        })

        stream.emit('get')
      })

      it('should callApi each time when we receive "get"', () => {
        const _requestUrl = sinon.stub(DataStream.prototype, '_requestUrl')

        expect(_requestUrl.calledOnce).to.eql(false)
        stream.emit('get')
        expect(_requestUrl.calledOnce).to.eql(true)

        _requestUrl.restore()
      })

      it('should emit "done" event, when limit were reached', (done) => {
        limit = 2
        client = DataStream({ limit })
        stream = client.stream()

        const spyGet = sinon.spy()
        stream.on('get', spyGet)

        stream.on('end', () => {
          expect(spyGet.callCount).to.eql(limit)
          done()
        })

        stream.emit('get')
      })
    })
  })
})
