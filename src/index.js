const DataStream = require('./services/dataStream')
const { logger, getDate } = require('utils/helpers')

function runtime () {
  // TODO: Attach custom uri keys to limit movies page limit, we should estimate parameters to met max of 1000 page per set(of filters)

  const instance = DataStream({limit: 1}).stream()
  let counter = 0
  instance.on('data', function ({ body }) {
    counter += 1
    body.results.forEach((item) => {
      logger.info(`${getDate()}:  ${item.original_title}`)
    })
  })

  instance.emit('get')
}

module.exports = runtime
