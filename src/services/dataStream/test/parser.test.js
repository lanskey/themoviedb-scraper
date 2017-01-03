const Parser = require('../parser')

describe('DataStream', () => {
  describe('Constructor', () => {
    let defaults = {}
    before(() => {
      defaults = {
        apiKey: null,
        limit: 3,
        url: 'http://api.themoviedb.org/3',
        endPoint: '/discover/movie'
      }
    })

    it('create new Constructor instance', () => {
      const client = new Parser()
      expect(client).to.be.instanceof(Parser)
    })
  })
})
