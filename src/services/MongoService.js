import mongoose from 'mongoose'

export default class MongoService {
  /**
   * [constructor description]
   * @param  {[type]} options.mongoUrl [description]
   * @return {[type]}                  [description]
   */
  constructor ({ MongoUrl, LogService }) {
    this.url = MongoUrl
    this.log = LogService
    this.instance = null
  }

  /**
   * [connect description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  async start (url) {
    this.log.debug('Starting MongoService instance...')
    return new Promise((resolve, reject) => {
      if (!this.instance) {
        this.instance = mongoose.connect(url || this.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, err => {
          if (err) {
            this.log.error(err)
            reject(err)
          } else {
            this.log.debug('MongoService instance started.')
            resolve(this.instance)
          }
        })
      } else {
        this.log.debug('MongoService instance already started.')
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
      this.log.debug('Stopping MongoService instance...')
      this.instance.connection.close()
      this.instance = null
      this.log.debug('MongoService instance stopped.')
    }
  }
}
