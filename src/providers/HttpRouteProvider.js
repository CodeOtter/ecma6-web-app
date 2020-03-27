import Express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

/**
 * [HttpRouteProvider description]
 * @param {[type]} options.StaticFileDir [description]
 */
function HttpRouteProvider ({ StaticFileDir, LoggingProvider }) {
  const express = Express()

  express.use(Express.static(path.join(__dirname, `/../../${StaticFileDir}`)))
  express.use(bodyParser.json())
  express.use(LoggingProvider.errorHandler())
  express.use(bodyParser.urlencoded({ extended: false }))

  return express
}

export default HttpRouteProvider
