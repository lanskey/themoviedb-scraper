const callApi = require('../../services/callApi')
const { route } = require('../../constants/api')
const { resultsResponse } = require('../fake-responses')

describe('Download movie', () => {
  describe('callApi', () => {
    beforeEach(() => {
      nock('http://api.themoviedb.org/3')
        .get('/discover/movie?api_key=9dee05d48efe51f51b15cc63b1fee3f5')
        .reply(200, resultsResponse)
    })
    it('Should return an array of movies', (done) => {
      callApi(route, (err, { results }) => {
        expect(err).to.eql(null)
        expect(Array.isArray(results)).to.eql(true)
        expect(results).to.have.length.above(1)

        done()
      })
    })

    it('Should store values in upper scope variable', () => {
      const expected = callApi(route, (err, { results }) => {
        expect(err).to.eql(null)
        return results
      })
      expect(expected).to.have.length(20)
    })
  })
})
