import restify from 'restify'
import path from 'path'

/**
 * [HttpRouteProvider description]
 * @param {[type]} options.StaticFileDir [description]
 */
function HttpRouteProvider ({ StaticFileDir, LoggingProvider, LogService }) {
  const log = LogService.silly

  log('Creating Restify Instance...')

  const router = restify.createServer({
    // @TODO change name
    name: 'ecma6-web-app',
    version: '0.1.0'
  })
  
  log('Preparing preliminary Restify middleware...')
  router.pre((request, response, next) => {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
    const message = `[${new Date(request._date).toISOString()}] <${ip}> ${request.method} ${request.url}`
    log(message);
    next()
  })
  router.pre(restify.plugins.pre.context())
  router.pre(restify.plugins.pre.dedupeSlashes())
  router.pre(restify.plugins.pre.sanitizePath())
  router.pre(restify.pre.pause())

  log('Preparing Restify middleware...')
  router.use(restify.plugins.jsonp())
  router.use(LoggingProvider.errorHandler())
  router.use(restify.plugins.urlEncodedBodyParser({ extended: false }))
  router.use(restify.plugins.jsonBodyParser())
  router.use(restify.plugins.multipartBodyParser())
  router.use(restify.plugins.gzipResponse())

  log('Defining the initial Restify route... (GET /)')
  router.get('/', restify.plugins.serveStatic({
    directory: path.join(__dirname, `/../../${StaticFileDir}`),
    default: 'index.html'
  }))

  return router
}

export default HttpRouteProvider
