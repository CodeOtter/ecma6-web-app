const td = require('testdouble')

function getSocket () {
  return {
    close: td.function(),
    emit: td.function(),
    on: td.function()
  }
}

const SocketProvider = (options) => {
  // @SETUP: Add methods you need to mock for HttpService here
  const provider = td.function(() => {
    return {
      ...getSocket(),
      of: td.function(() => {
        return getSocket()
      })
    }
  })

  return provider
}

module.exports = SocketProvider
