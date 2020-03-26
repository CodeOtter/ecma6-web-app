const getProvider = require('../../../src/providers/SmsProvider').default
// const td = require('testdouble')

const SmsProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = SmsProvider
