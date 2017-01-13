const DataStream = require('./services/dataStream')

function runtime () {
  // TODO: validate X-RateLimit-Remaining header and if > 0, run another 'callApi',
  //  else wait appropriate amount of time returned by X-RateLimit-Reset header

  // TODO: Prepare a .log file which will contain downloaded movie titles
  // TODO: Attach custom uri keys to limit movies page limit, we should estimate parameters to met max of 1000 page per set(of filters)

  const instance = DataStream({limit: 100}).stream()
  let counter = 0
  instance.on('data', function (data) {
    counter += 1
    console.log(counter)
  })

  instance.emit('get')
  instance.emit('get')
}

module.exports = runtime
