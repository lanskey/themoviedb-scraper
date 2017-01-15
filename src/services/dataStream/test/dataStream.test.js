const DataStream = require('../dataStream')
const EventEmitter = require('events').EventEmitter
const { endpoint, baseUrl, apiKey, route } = require('src/constants/api')
const URL = require('url-parse')

describe('DataStream', () => {
  describe('Constructor', () => {
    let defaults = {}
    beforeEach(() => {
      defaults = {
        apiKey: '9dee05d48efe51f51b15cc63b1fee3f5',
        limit: null,
        baseUrl: 'http://api.themoviedb.org/3',
        endPoint: '/discover/movie',
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
    let stream
    let client
    let limit
    beforeEach(() => {
      client = DataStream({limit: 1})
      stream = client.stream()
    })

    describe('stream', () => {
      it('should have stream method, which is instance of eventEmitter', () => {
        expect(stream).to.be.instanceof(EventEmitter)
      })

      it('should emit "data" event, when data were received', (done) => {
        nock(route)
          .get('')
          .query(true)
          .reply(200, { results: [ {} ], totalPages: 2 })
        stream.on('data', (data) => {
          try {
            expect(data.status).to.eql(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        stream.emit('get')
      })
    })

    describe('_prepareUrl', () => {
      it('should prepare url with default query', () => {
        client._prepareUrl()
        expect(client.url.href).to.eql(route)
      })
    })

    describe('_prepareQuery', () => {
      it('should prepare query for url', () => {
        client.url = new URL(`test`)
        client._prepareQuery()

        const expectedRoute = `test?api_key=${apiKey}`
        expect(client.url.href).to.eql(expectedRoute)
      })
    })

    describe('_removeFromQuery', () => {
      it('should remove property from and update url', () => {
        client.url = new URL(`test`)
        client._prepareQuery()
        client._removeFromQuery('api_key')

        const expectedRoute = `test`
        expect(client.url.href).to.eql(expectedRoute)
      })
    })

    describe('_addToQuery', () => {
      it('should add property to query and update url', () => {
        client.url = new URL(`test`)
        client._prepareQuery()
        client._addToQuery({ page: 5 })

        const expectedRoute = `test?api_key=${apiKey}&page=5`
        expect(client.url.href).to.eql(expectedRoute)
      })
    })

    describe('_updateQuery', () => {
      it('should update url query', () => {
        client.url = new URL(`test`)
        client._prepareUrl()
        expect(client.url.href).to.eql(route)

        client.query = { page: 5 }
        client._updateQuery()
        expect(client.url.href).to.not.eql(route)
      })
    })
    //
    // it('should callApi each time when we receive "get"', () => {
    //   const _requestUrl = sinon.stub(DataStream.prototype, '_requestUrl')
    //
    //   expect(_requestUrl.calledOnce).to.eql(false)
    //   stream.emit('get')
    //   expect(_requestUrl.calledOnce).to.eql(true)
    //
    //   _requestUrl.restore()
    // })
    //
    // it('should emit "done" event, when limit were reached', (done) => {
    //   nock(baseUrl)
    //     .get(endpoint)
    //     .query(true)
    //     .reply(200, { results: [ {} ] })
    //   const spyGet = sinon.spy(DataStream.prototype, '_requestUrl')
    //
    //   stream.on('data', () => {
    //     expect(spyGet.callCount).to.eql(1)
    //     spyGet.restore()
    //     done()
    //   })
    //
    //   stream.emit('get')
    // })
    //
    // it('should pause xRateLimitRemaining > 0 and call once again emit "get"', (done) => {
    //   nock(baseUrl)
    //     .get(endpoint)
    //     .query(true)
    //     .reply(429, { 'message': 'request limit occur', 'statusCode': '429' }, { 'Retry-After': '5' })
    //
    //   const _delayRequestSpy = sinon.spy(DataStream.prototype, '_delayRequest')
    //   stream.on('data', () => {
    //     expect(_delayRequestSpy.callCount).to.eql(1)
    //     done()
    //   })
    //
    //   stream.emit('get')
    // })
  })
})
