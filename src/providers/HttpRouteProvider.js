import restify from 'restify'
import bodyParser from 'body-parser'
import path from 'path'

/**
 * [HttpRouteProvider description]
 * @param {[type]} options.StaticFileDir [description]
 */
function HttpRouteProvider ({ StaticFileDir, LoggingProvider }) {
  const router = restify.createServer()

  router.get('/', restify.plugins.serveStatic({
    directory: path.join(__dirname, `/../../${StaticFileDir}`),
    default: 'index.html'
  }))

  router.use(bodyParser.json())
  router.use(LoggingProvider.errorHandler())
  router.use(bodyParser.urlencoded({ extended: false }))

  return router
}

export default HttpRouteProvider
