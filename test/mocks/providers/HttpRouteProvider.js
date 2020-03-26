const getProvider = require('../../../src/providers/HttpRouteProvider').default
// const td = require('testdouble')

const HttpRouteProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = HttpRouteProvider
