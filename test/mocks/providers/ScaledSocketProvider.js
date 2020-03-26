const getProvider = require('../../../src/providers/ScaledSocketProvider').default
const td = require('testdouble')

const ScaledSocketProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  td.replace(provider, 'publish')
  td.replace(provider, 'fire')
  td.replace(provider, 'signal')
  td.replace(provider, 'addListener')
  td.replace(provider, 'subscribe')
  td.replace(provider, 'unsubscribe')

  return provider
}

module.exports = ScaledSocketProvider
