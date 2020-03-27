const getProvider = require('../../../src/providers/AirtableProvider').default
// const td = require('testdouble')

const AirtableProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = AirtableProvider
