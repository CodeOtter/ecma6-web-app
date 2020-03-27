import Rollbar from 'rollbar'

/**
 * [LoggingProvider description]
 * @param {[type]} options.RollbarAccessToken [description]
 */
function LoggingProvider ({ RollbarAccessToken }) {
  return new Rollbar({
    accessToken: RollbarAccessToken,
    captureUncaught: true,
    captureUnhandledRejections: true
  })
}

export default LoggingProvider
