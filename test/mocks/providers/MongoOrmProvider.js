const getProvider = require('../../../src/providers/MongoOrmProvider').default
const td = require('testdouble')
const mongoUnit = require('mongo-unit')

const MongoOrmProvider = (options) => {
  const provider = getProvider(options)
  const connect = provider.connect

  td.replace(provider, 'connect', async (url, config, callback) => {
    await mongoUnit.start()
    await connect(mongoUnit.getUrl(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    callback()
  })

  td.replace(provider, 'close', async (callback) => {
    return mongoUnit.stop()
  })

  return provider
}

module.exports = MongoOrmProvider
