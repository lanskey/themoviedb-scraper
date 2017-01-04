const EventEmitter = require('events').EventEmitter
const DataStream = require('../dataStream')

describe('DataStream', () => {
  describe('Constructor', () => {
    let defaults = {}
    beforeEach(() => {
      defaults = {
        apiKey: null,
        limit: 3,
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
      const newOptions = {apiKey: 'test'}
      const client = DataStream(newOptions)

      const result = Object.assign(defaults, newOptions)
      expect(client.options).to.be.eql(result)
    })

    it('should have stream method, which is instance of eventEmitter', () => {
      const client = DataStream().stream()
      expect(client).to.be.instanceof(EventEmitter)
    })
    
    it('it should console.log msg each time receiving "display" event', () => {
      const client = DataStream().stream()
      sinon.stub(console, 'log')

      client.emit('display')
      expect(console.log.calledOnce).to.eql(true)

      client.emit('display')
      expect(console.log.calledTwice).to.eql(true)
    })
    
  })
})
