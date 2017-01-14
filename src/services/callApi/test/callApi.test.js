const { endpoint, baseUrl } = require('src/constants/api')

const callApi = require('../callApi')
const { resultsResponse } = require('./fake-response')

describe('Download movie', () => {
  describe('callApi', () => {
    let url
    beforeEach(() => {
      url = `${baseUrl}${endpoint}`
    })

    it('Should return an array of movies', () => {
      nock(baseUrl)
        .get(endpoint)
        .reply(200, resultsResponse)

      return (
        callApi(url)
          .then(({ body: { results } }) => {
            expect(Array.isArray(results)).to.eql(true)
            expect(results).to.have.length.above(1)
          })
      )
    })

    it('Should handle 429 status code as error', () => {
      nock(baseUrl)
        .get(endpoint)
        .reply(429, {'message': 'request limit occur', 'statusCode': '429'}, { 'Retry-After': '5' })

      return (
        expect(callApi(url)).be.rejected.and.eventually.have.property('status', 429)
      )
    })

    it('Should handle unexpected error (no match for requested url)', () => {
      return (
        expect(callApi('/test')).to.be.rejected
      )
    })
  })
})
