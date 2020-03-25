import { dependencyOrder } from '../config'

export default class AppService {
  /**
   * [constructor description]
   * @param  {[type]} services [description]
   * @return {[type]}          [description]
   */
  constructor (options) {
    this.services = {}

    for (const dep of dependencyOrder) {
      this.services[dep] = options[dep]
    }

    this.log = options.LogService
    this.instances = null
    this.log.debug('AppService constructed')
  }

  /**
   * [start description]
   * @return {[type]} [description]
   */
  async start () {
    this.log.debug('Starting AppService...')
    if (!this.instances) {
      this.instances = {}
      for (const key of Object.keys(this.services)) {
        if (this.services[key].start) {
          this.instances[key] = await this.services[key].start()
        }
      }
    }
    this.log.debug('AppService started')
    return this
  }

  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    this.log.debug('Stopping AppService...')
    if (this.instances) {
      for (const key of Object.keys(this.services)) {
        if (this.services[key].stop) {
          this.instances[key] = this.services[key].stop()
        }
      }
      this.instances = null
    }
    this.log.debug('AppService stopped')
  }
}
