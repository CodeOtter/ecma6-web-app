const getProvider = require('../../../src/providers/VideoStreamProvider').default
const td = require('testdouble')

const VideoStreamProvider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  td.replace(provider, 'createSession')
  td.replace(provider, 'startArchive')
  td.replace(provider, 'stopArchive')
  td.replace(provider, 'deleteArchive')
  td.replace(provider, 'listArchives')
  td.replace(provider, 'signal')
  td.replace(provider, 'forceDisconnect')
  td.replace(provider, 'getStream')
  td.replace(provider, 'listStreams')

  return provider
}

module.exports = VideoStreamProvider
