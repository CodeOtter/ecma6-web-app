import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'http'

export default class HttpService {
  /**
   * [constructor description]
   * @param  {[type]} options.httpPort      [description]
   * @param  {[type]} options.staticFileDir [description]
   * @return {[type]}                       [description]
   */
  constructor ({ httpPort, staticFileDir, logService }) {
    this.port = httpPort
    this.staticFileDir = staticFileDir
    this.log = logService
    this.express = express()
    this.server = http.Server(this.express)
    this.instance = false
  }

  /**
   * [start description]
   * @param  {[type]} port [description]
   * @return {[type]}      [description]
   */
  async start (port, staticFileDir) {
    this.log.debug('Starting HttpService...')
    return new Promise(resolve => {
      if (!this.instance) {
        this.express.use(express.static(path.join(__dirname, `/../../${staticFileDir || this.staticFileDir}`)))
        this.express.use(bodyParser.json())
        this.express.use(bodyParser.urlencoded({ extended: false }))

        require('../routes')

        const portNumber = port || this.port
        this.instance = this.server.listen(portNumber, () => {
          this.log.info(`HttpService started, listening on ${portNumber}`)
          resolve(this.instance)
        })
      } else {
        this.log.debug('HttpService already started.')
        resolve(this.instance)
      }
    })
  }

  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    if (this.instance) {
      this.log.debug('Stopping HttpService...')
      this.instance.close()
      this.instance = null
      this.log.debug('HttpService stopped.')
    }
  }
}
