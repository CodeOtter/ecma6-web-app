const getProvider = require('../../../src/providers/MongoOrmProvider').default
const td = require('testdouble')

const MongoOrmProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  td.replace(provider, 'connect', (url, config, callback) => {
    callback()
  })

  return provider
}

module.exports = MongoOrmProvider
