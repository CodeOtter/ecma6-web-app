const noop = () => {}

export default class SocketService {
  constructor ({ HttpService, LogService, UsePubnub, SocketProvider, ScaledSocketProvider }) {
    this.http = HttpService
    this.log = LogService
    this.usePubnub = UsePubnub
    this.channels = new Map()
    this.scaledSocketProvider = ScaledSocketProvider
    this.socketProvider = SocketProvider
    this.instance = null
  }

  /**
   * [start description]
   * @return {[type]} [description]
   */
  start () {
    this.log.debug('Starting SocketService...')
    if (!this.instance) {
      if (this.usePubnub) {
        this.instance = this.scaledSocketProvider
      } else {
        this.instance = this.socketProvider(this.http.router.server)
        this.log.debug('SocketService started.')
      }
    } else {
      this.log.debug('SocketService already started.')
    }
    return this.instance
  }

  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    if (this.instance) {
      this.log.debug('Stoppijng SocketService...')
      this.channels.forEach((channel) => {
        channel.close()
      })
      this.channels = new Map()
      this.instance.close()
      this.instance = null
      this.log.debug('SocketService stopped.')
    }
  }

  /**
   * [publish description]
   * @param  {[type]} channelName [description]
   * @param  {[type]} message     [description]
   * @param  {[type]} meta        [description]
   * @return {[type]}             [description]
   */
  async publish (channelName, message, meta) {
    return new Promise((resolve, reject) => {
      if (this.usePubnub) {
        this.instance.publish({
          message,
          channel: channelName,
          meta
        }, (status, response) => {
          if (status.error) {
            reject(status)
          } else {
            resolve(status, response)
          }
        })
      } else {
        const target = !message
          // Send the message to the root instance
          ? this.instance
          // Send the message to a specific channel
          : this.channels.get(channelName)

        if (target) {
          message.meta = meta
          target.emit(message, resolve)
        } else {
          resolve(false)
        }
      }
    })
  }

  /**
   * [fire description]
   * @param  {[type]} channelName [description]
   * @param  {[type]} message     [description]
   * @param  {[type]} meta        [description]
   * @return {[type]}             [description]
   */
  async fire (channelName, message, meta) {
    return new Promise((resolve, reject) => {
      if (this.usePubnub) {
        this.instance.fire({
          message,
          channel: channelName,
          meta
        }, (status, response) => {
          if (status.error) {
            reject(status)
          } else {
            resolve(status, response)
          }
        })
      } else {
        const target = !message
          // Send the message to the root instance
          ? this.instance
          // Send the message to a specific channel
          : this.channels.get(channelName)

        if (target) {
          message.meta = meta
          target.emit(message, resolve)
        } else {
          resolve(false)
        }
      }
    })
  }

  /**
   * [signal description]
   * @param  {[type]} channelName [description]
   * @param  {[type]} message     [description]
   * @return {[type]}             [description]
   */
  async signal (channelName, message) {
    return new Promise((resolve, reject) => {
      if (this.usePubnub) {
        this.instance.signal({
          message,
          channel: channelName
        }, (status, response) => {
          if (status.error) {
            reject(status)
          } else {
            resolve(status, response)
          }
        })
      } else {
        const target = !message
          // Send the message to the root instance
          ? this.instance
          // Send the message to a specific channel
          : this.channels.get(channelName)

        if (target) {
          target.emit(message, resolve)
        } else {
          resolve(false)
        }
      }
    })
  }

  /**
   * [onConnection description]
   * @param  {[type]} onConnection [description]
   * @param  {[type]} onMessage    [description]
   * @return {[type]}              [description]
   */
  onConnection (onConnection, onMessage) {
    if (this.usePubnub) {
      this.instance.addListener({
        presence: onConnection,
        message: onMessage
      })
    } else {
      this.instance.on('connection', socket => {
        onConnection(socket)
        socket.on('message', onMessage)
      })
    }
  }

  /**
   * [subscribe description]
   * @param  {[type]} channels     [description]
   * @param  {[type]} onConnection [description]
   * @param  {[type]} onMessage    [description]
   * @return {[type]}              [description]
   */
  subscribe (channels, onConnection = noop, onMessage = noop) {
    if (this.usePubnub) {
      this.instance.subscribe({
        channels
      })
    } else {
      for (const channelName of channels) {
        const noChannelExists = !this.channels.get(channelName)

        if (noChannelExists) {
          this.channels.set(this.instance.of(channelName))
        }

        const channel = this.channels.get(channelName)
        channel.on('connection', socket => {
          onConnection(socket)
          socket.on('message', onMessage)
        })
      }
    }
  }

  /**
   * [unsubscribe description]
   * @param  {[type]} channels [description]
   * @return {[type]}          [description]
   */
  unsubscribe (channels) {
    if (this.usePubnub) {
      this.instance.unsubscribe({
        channels
      })
    } else {
      for (const channelName of channels) {
        const channel = this.channels.get(channelName)

        if (channel) {
          channel.close()
          this.channels.set(channelName, undefined)
        }
      }
    }
  }
}
