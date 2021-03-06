const baseUrl = 'http://api.themoviedb.org/3'
const apiKey = '9dee05d48efe51f51b15cc63b1fee3f5'
const endpoint = '/discover/movie'
const route = `${baseUrl}${endpoint}?api_key=${apiKey}`
const genres = require('./genres')

module.exports = {
  baseUrl,
  route,
  endpoint,
  apiKey,
  genres
}
