const getProvider = require('../../../src/providers/HttpServerProvider').default
const td = require('testdouble')

const HttpServerProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  td.replace(provider, 'Server', () => {
    return {
      listen: (portNumber, callback) => {
        callback()
      }
    }
  })

  return provider
}

module.exports = HttpServerProvider
