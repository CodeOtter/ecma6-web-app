const getProvider = require('../../../src/providers/TwitterCollectorProvider').default
// const td = require('testdouble')

const TwitterCollectorProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = TwitterCollectorProvider
