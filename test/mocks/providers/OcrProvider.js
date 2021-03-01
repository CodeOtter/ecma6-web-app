const getProvider = require('../../../src/providers/OcrProvider').default
// const td = require('testdouble')

const OcrProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = OcrProvider
