const DataStream = require('../dataStream')
const EventEmitter = require('events').EventEmitter
const { endpoint, baseUrl } = require('src/constants/api')

describe('DataStream', () => {
  describe('Constructor', () => {
    let defaults = {}
    beforeEach(() => {
      defaults = {
        apiKey: '9dee05d48efe51f51b15cc63b1fee3f5',
        limit: null,
        baseUrl: 'http://api.themoviedb.org/3',
        endPoint: '/discover/movie',
        url: `http://api.themoviedb.org/3/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5`,
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
      let stream
      let client
      let limit
      beforeEach(() => {
        client = DataStream()
        stream = client.stream()

      })

      it('should have stream method, which is instance of eventEmitter', () => {
        expect(stream).to.be.instanceof(EventEmitter)
      })

      it('should emit "data" event, when data were received', (done) => {
        const headers = {
          'X-RateLimit-Remaining': 39,
        }
        nock(baseUrl)
          .get(endpoint)
          .query(true)
          .reply(200, { results: [ {} ] }, headers)

        stream.on('data', (data) => {
          expect(data.body.results.length).to.eql(1)
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
        nock(baseUrl)
          .get(endpoint)
          .query(true)
          .reply(200, { results: [ {} ] })
        const spyGet = sinon.spy(DataStream.prototype, '_requestUrl')

        stream.on('data', () => {
          expect(spyGet.callCount).to.eql(1)
          spyGet.restore()
          done()
        })

        stream.emit('get')
      })

      it('should pause xRateLimitRemaining > 0 and call once again emit "get"', (done) => {
        nock(baseUrl)
          .get(endpoint)
          .query(true)
          .reply(429, { 'message': 'request limit occur', 'statusCode': '429' }, { 'Retry-After': '5' })

        const _delayRequestSpy = sinon.spy(DataStream.prototype, '_delayRequest')
        stream.on('data', () => {
          expect(_delayRequestSpy.callCount).to.eql(1)
          done()
        })

        stream.emit('get')
      })
    })
  })
})
