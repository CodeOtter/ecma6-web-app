const ONE_WEEK = (new Date().getTime() / 1000) + (7 * 24 * 60 * 60)

export default class VideoStreamService {
  constructor ({ VideoStreamProvider, LogService }) {
    this.streamer = VideoStreamProvider
    this.log = LogService
    this.instance = null
  }

  /**
   * [start description]
   * @param  {[type]} location    [description]
   * @param  {[type]} archiveMode [description]
   * @param  {String} mediaMode   [description]
   * @return {[type]}             [description]
   */
  async start (location, archiveMode, mediaMode = 'routed') {
    this.log.debug('Starting VideoStreamService...')
    return new Promise((resolve, reject) => {
      if (!this.instance) {
        this.streamer.createSession({
          location,
          archiveMode,
          mediaMode
        }, (err, session) => {
          if (err) {
            reject(err)
          } else {
            this.instance = session
          }
        })
      } else {
        this.log.debug('VideoStreamService already started.')
      }

      resolve(this.instance)
    })
  }

  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    if (this.instance) {
      this.log.debug('Stoppijng VideoStreamService...')
      this.instance.close()
      this.instance = null
      this.log.debug('VideoStreamService stopped.')
    }
  }

  /**
   * [getToken description]
   * @param  {[type]} data       [description]
   * @param  {[type]} expireTime [description]
   * @param  {[type]} role       [description]
   * @return {[type]}            [description]
   */
  async getToken (data, expireTime = ONE_WEEK, role) {
    return this.instance.generateToken({
      role,
      expireTime,
      data
    })
  }

  /**
   * [startArchive description]
   * @param  {[type]}  name     [description]
   * @param  {Boolean} hasVideo [description]
   * @return {[type]}           [description]
   */
  async startArchive (name, hasVideo = true) {
    return new Promise((resolve, reject) => {
      var archiveOptions = {
        name,
        hasVideo
      }

      this.streamer.startArchive(this.session.sessionId, archiveOptions, (err, archive) => {
        if (err) {
          reject(err)
        } else {
          resolve(archive)
        }
      })
    })
  }

  /**
   * [stopArchive description]
   * @param  {[type]} archiveId [description]
   * @return {[type]}           [description]
   */
  async stopArchive (archiveId) {
    return new Promise((resolve, reject) => {
      this.streamer.stopArchive(archiveId, (err, archive) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * [deleteArchive description]
   * @param  {[type]} archiveId [description]
   * @return {[type]}           [description]
   */
  async deleteArchive (archiveId) {
    return new Promise((resolve, reject) => {
      this.streamer.deleteArchive(archiveId, (err, archive) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * [listArchives description]
   * @param  {Number} offset [description]
   * @param  {Number} count  [description]
   * @return {[type]}        [description]
   */
  async listArchives (offset = 0, count = 50) {
    return new Promise((resolve, reject) => {
      this.streamer.listArchives({
        offset,
        count
      }, (err, archives, totalCount) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            archives,
            totalCount
          })
        }
      })
    })
  }

  /**
   * [signal description]
   * @param  {[type]} data      [description]
   * @param  {String} type      [description]
   * @param  {[type]} sessionId [description]
   * @return {[type]}           [description]
   */
  async signal (data, type = 'chat', connectionId, sessionId = this.session.sessionId) {
    return new Promise((resolve, reject) => {
      if (connectionId) {
        this.streamer.signal(sessionId, connectionId, {
          type,
          data
        }, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      } else {
        this.streamer.signal(sessionId, {
          type,
          data
        }, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      }
    })
  }

  /**
   * [disconnect description]
   * @param  {[type]} connectionId [description]
   * @param  {[type]} sessionId    [description]
   * @return {[type]}              [description]
   */
  async disconnect (connectionId, sessionId = this.session.sessionId) {
    return new Promise((resolve, reject) => {
      this.streamer.forceDisconnect(connectionId, sessionId, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * [getStream description]
   * @param  {[type]} streamId  [description]
   * @param  {[type]} sessionId [description]
   * @return {[type]}           [description]
   */
  async getStream (streamId, sessionId = this.session.sessionId) {
    return new Promise((resolve, reject) => {
      this.streamer.getStream(sessionId, streamId, (err, stream) => {
        if (err) {
          reject(err)
        } else {
          resolve(stream)
        }
      })
    })
  }

  /**
   * [listStreams description]
   * @param  {[type]} sessionId [description]
   * @return {[type]}           [description]
   */
  async listStreams (sessionId = this.session.sessionId) {
    return new Promise((resolve, reject) => {
      this.streamer.listStreams(sessionId, (err, streams) => {
        if (err) {
          reject(err)
        } else {
          resolve(streams)
        }
      })
    })
  }
}
