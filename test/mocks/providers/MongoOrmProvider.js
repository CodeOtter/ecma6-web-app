const getProvider = require('../../../src/providers/MongoOrmProvider').default
const td = require('testdouble')
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer()

const MongoOrmProvider = (options) => {
  const provider = getProvider(options)
  const connect = provider.connect

  td.replace(provider, 'connect', async (url, config = {}, callback) => {
    const mongoUrl = await mongoServer.getUri()

    await connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    callback()
  })

  td.replace(provider, 'close', async (callback) => {
    mongoServer.stop()
  })

  td.replace(provider, 'stop', async (callback) => {
    mongoServer.stop()
  })

  return provider
}

module.exports = MongoOrmProvider
