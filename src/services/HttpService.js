import { getFunctionName } from '../actions/transform'

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} actions
 */
export default class HttpService {
  /**
   * [constructor description]
   * @param  {[type]} options.httpPort      [description]
   * @param  {[type]} options.staticFileDir [description]
   * @return {[type]}                       [description]
   */
  constructor ({ HttpPort, StaticFileDir, HttpRouteProvider, LogService }) {
    this.port = HttpPort
    this.staticFileDir = StaticFileDir
    this.log = LogService
    this.router = HttpRouteProvider
    this.instance = false
    this.actions = new Map()
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
        this.log.silly('Defining HTTP routes...')
        require('../routes')
        const portNumber = port || this.port

        this.instance = this.router.listen(portNumber, () => {
          this.log.info(`HttpService started, listening on ${this.instance.address().port}`)
          // this.log.silly(this.router.getDebugInfo())
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

  getPort () {
    if (this.instance) {
      return this.instance.address().port
    }
    return undefined
  }

  /**
   *
   * @param {*} endpoint
   * @param {*} action
   */
  getOne (endpoint, actions) {
    return this.router.get(`/${endpoint}/:id`, async (req, res) => {
      return this._performActions(req, res, actions)
    })
  }

  /**
   *
   * @param {*} endpoint
   * @param {*} actions
   */
  get (endpoint, actions) {
    return this.router.get(`/${endpoint}`, async (req, res) => {
      return this._performActions(req, res, actions)
    })
  }

  /**
   *
   * @param {*} endpoint
   * @param {*} action
   */
  post (endpoint, actions) {
    return this.router.post(`/${endpoint}`, async (req, res) => {
      return this._performActions(req, res, actions)
    })
  }

  /**
   *
   * @param {*} endpoint
   * @param {*} action
   */
  patch (endpoint, actions) {
    return this.router.patch(`/${endpoint}/:id`, async (req, res) => {
      return this._performActions(req, res, actions)
    })
  }

  /**
   *
   * @param {*} endpoint
   * @param {*} action
   */
  delete (endpoint, actions) {
    return this.router.del(`/${endpoint}/:id`, async (req, res) => {
      return this._performActions(req, res, actions)
    })
  }

  async _performActions (req, res, actions = []) {
    const results = {}
    this.log.silly('Performing HTTP route actions...')

    try {
      for (const action of actions) {
        let actionName = this.actions.get(action)

        if (!actionName) {
          actionName = getFunctionName(action)
          this.actions.set(action, actionName)
        }

        this.log.debug(`Performing HTTP route action: ${actionName}`)
        results[actionName] = await action(req, res, results)
      }

      if (results.ErrorOutput) {
        return res.send(results.ErrorOutput.status || 400, results.ErrorOutput.error)
      }

      // @TODO Build debugging output
      return res.json(results.JsonOutput)
    } catch (e) {
      this.log.error(e)
      return res.send(e.status || 500, e)
    }
  }
}
