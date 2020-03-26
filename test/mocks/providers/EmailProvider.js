const getProvider = require('../../../src/providers/EmailProvider').default
// const td = require('testdouble')

const EmailProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = EmailProvider
