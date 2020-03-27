const getProvider = require('../../../src/providers/CloudProvider').default
// const td = require('testdouble')

const CloudProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = CloudProvider
