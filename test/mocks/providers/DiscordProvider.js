const getProvider = require('../../../src/providers/DiscordProvider').default
// const td = require('testdouble')

const DiscordProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return provider
}

module.exports = DiscordProvider
