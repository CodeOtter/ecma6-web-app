const getProvider = require('../../../src/providers/AuthenticationProvider').default
// const td = require('testdouble')

const AuthenticationProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = AuthenticationProvider
