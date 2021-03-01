const getProvider = require('../../../src/providers/LoggingProvider').default
// const td = require('testdouble')

const LoggingProvider = (options) => {
  // const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  // td.replace(provider, 'start')

  return {
    errorHandler: () => {
      return function (err, request, response, next) {
        var cb = function (rollbarError) {
          if (rollbarError) {
            console.error('Error reporting to rollbar, ignoring: ' + rollbarError);
          }
          return next(err, request, response);
        };
        if (!err) {
          return next(err, request, response);
        }
    
        if (err instanceof Error) {
          return cb(err, request)
          // return this.error(err, request, cb);
        }
        return cb('Error: ' + err, request);
      }
    }
  }
}

module.exports = LoggingProvider
