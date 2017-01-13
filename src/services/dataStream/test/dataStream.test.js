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

    it('instance should contain xRateLimitRemaining variable by default to 40', () => {
      const client = DataStream()
      expect(client).to.deep.eql(DataStream())

      expect(client.xRateLimitRemaining).to.be.eql(40)
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
        const headers = {
          'X-RateLimit-Remaining': 39
        }
        nock(baseUrl)
          .get(endpoint)
          .query(true)
          .reply(200, { results: [ {} ] }, headers)
      })

      it('should have stream method, which is instance of eventEmitter', () => {
        expect(stream).to.be.instanceof(EventEmitter)
      })

      it('should emit "data" event, when data were received', (done) => {
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

      // it should check if X-RateLimit-Remaining header > 0, before it make new request

      // it should continue making request when times up.

      it('should update xRateLimitRemaining each time we make _requestUrl', (done) => {
        const defaultValue = client.xRateLimitRemaining
        stream.on('data', () => {
          try {
            expect(client.xRateLimitRemaining).to.eql(defaultValue - 1)
            done()
          }
          catch (err) {
            done(err)
          }
        })
        stream.emit('get')
      })

      it('should validate xRateLimitRemaining, before it make new request', (done) => {
        client.xRateLimitRemaining = 0
        const _validateLimitRemainingSpy = sinon.spy(DataStream.prototype, '_validateLimitRemaining')

        stream.once('get', () => {
          expect(_validateLimitRemainingSpy.calledOnce).to.eql(true)
          done()
        })

        stream.emit('get')

        _validateLimitRemainingSpy.restore()
      })

      it('should pause when xRateLimitRemaining > 0 and call once again emit "get"', (done) => {
        client.xRateLimitRemaining = 0

        stream.on('data', () => {
          expect(_requestUrlSpy.calledTwice).to.eql(true)
          _requestUrlSpy.restore()
          done()
        })

        stream.emit('get')
        const _requestUrlSpy = sinon.spy(DataStream.prototype, '_requestUrl')
      })
    })
  })
})
