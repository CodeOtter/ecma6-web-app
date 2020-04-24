export default class HttpService {
  /**
   * [constructor description]
   * @param  {[type]} options.httpPort      [description]
   * @param  {[type]} options.staticFileDir [description]
   * @return {[type]}                       [description]
   */
  constructor ({ HttpPort, StaticFileDir, HttpRouteProvider, AuthenticationProvider, LogService }) {
    this.port = HttpPort
    this.staticFileDir = StaticFileDir
    this.log = LogService
    this.router = HttpRouteProvider
    this.getAuth = AuthenticationProvider
    this.instance = false
  }

  /**
   * [start description]
   * @param  {[type]} port [description]
   * @return {[type]}      [description]
   */
  async start (port) {
    this.log.debug('Starting HttpService...')
    return new Promise(resolve => {
      if (!this.instance) {
        require('../routes')
        const portNumber = port || this.port

        this.instance = this.router.listen(portNumber, () => {
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
