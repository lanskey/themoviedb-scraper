const EventEmitter = require('events').EventEmitter
const DataStream = require('../dataStream')

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
      const newOptions = {apiKey: 'test'}
      const client = DataStream(newOptions)

      const result = Object.assign(defaults, newOptions)
      expect(client.options).to.be.eql(result)
    })
  })

  describe('Methods', () => {
    describe('stream', () => {
      // what i want achieve?
      // 1. it should emit 'done' event, when msg were displayed
      // 2. it should emit 'error' when display couldn't be finished
      // 3. it should display messages until reach limit, if limit were specified

      it('should have stream method, which is instance of eventEmitter', () => {
        const client = DataStream()
        expect(client.stream()).to.be.instanceof(EventEmitter)
      })

      it('it should console.log msg each time receiving "display" event', () => {
        const client = DataStream()
        sinon.stub(console, 'log')

        client.stream().emit('display')
        expect(console.log.calledOnce).to.eql(true)

        client.stream().emit('display')
        expect(console.log.calledTwice).to.eql(true)
      })
    })
  })
})
