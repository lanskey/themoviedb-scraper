const baseUrl = 'http://api.themoviedb.org/3'
const apiKey = 'api_key=9dee05d48efe51f51b15cc63b1fee3f5'
const endpoint = '/discover/movie'
const route = `${baseUrl}${endpoint}?${apiKey}`

module.exports = {
  baseUrl,
  route,
  endpoint,
  apiKey
}
