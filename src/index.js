const DataStream = require('./services/dataStream')
const { logger, getDate } = require('utils/helpers')

function runtime () {
  // TODO: Attach custom uri keys to limit movies page limit, we should estimate parameters to met max of 1000 page per set(of filters)
  // TODO: Improve constructing urls for calls

  const instance = DataStream({limit: 'MAX'}).stream()

  instance.on('data', function ({ body }) {
    // body.results.forEach((item) => {
    //   logger.info(`${getDate()}:  ${item.original_title}`)
    // })
    logger.info(`${getDate()}:  ${body.results[0].original_title}`)
  })

  instance.emit('get')
}

module.exports = runtime
