const { endpoint, baseUrl } = require('src/constants/api')

const callApi = require('../callApi')
const { resultsResponse } = require('./fake-response')

describe('Download movie', () => {
  describe('callApi', () => {
    let url
    beforeEach(() => {
      url = `${baseUrl}${endpoint}`
      nock(baseUrl)
        .get(endpoint)
        .reply(200, resultsResponse)
    })
    it('Should return an array of movies', () => {
      return callApi(url)
        .then(({ results }) => {
          expect(Array.isArray(results)).to.eql(true)
          expect(results).to.have.length.above(1)
        })
    })

    it('Should handle 429 status code as error', () => {
      nock(baseUrl)
        .get(endpoint)
        .replyWithError({ 'message': 'something awful happened', 'code': '429' })

      return callApi(baseUrl)
        .then(({ results }) => {
          expect(Array.isArray(results)).to.eql(true)
          expect(results).to.have.length.above(1)
        })
    })
  })
})
