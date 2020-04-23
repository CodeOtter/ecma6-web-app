import Express from 'express'
import restify from 'restify'
import bodyParser from 'body-parser'
import path from 'path'

/**
 * [HttpRouteProvider description]
 * @param {[type]} options.StaticFileDir [description]
 */
function HttpRouteProvider ({ StaticFileDir, LoggingProvider }) {
  // const httpRest = restify.createServer()
  const httpRest = Express()

  httpRest.use(Express.static(path.join(__dirname, `/../../${StaticFileDir}`)))
  httpRest.use(bodyParser.json())
  httpRest.use(LoggingProvider.errorHandler())
  httpRest.use(bodyParser.urlencoded({ extended: false }))

  return httpRest
}

export default HttpRouteProvider
