import socketIo from 'socket.io'

export default class SocketService {
  constructor ({ HttpService, LogService }) {
    this.http = HttpService
    this.log = LogService
    this.instance = null
  }

  /**
   * [start description]
   * @return {[type]} [description]
   */
  async start () {
    this.log.debug('Starting SocketService...')
    return new Promise(resolve => {
      if (!this.instance) {
        this.instance = socketIo(this.http.server)
        this.instance.on('connection', () => {
          this.log.debug('New socket connection...')
        })
        this.log.debug('SocketService started.')
        resolve(this.instance)
      } else {
        this.log.debug('SocketService already started.')
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
      this.log.debug('Stoppijng SocketService...')
      this.instance.close()
      this.instance = null
      this.log.debug('SocketService stopped.')
    }
  }
}
