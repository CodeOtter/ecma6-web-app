export default class AuthenticationService {
    /**
     * [constructor description]
     * @param  {[type]} options.httpPort      [description]
     * @param  {[type]} options.staticFileDir [description]
     * @return {[type]}                       [description]
     */
    constructor ({ AuthenticationProvider }) {
      this.getAuthStrategy = AuthenticationProvider
    }

    /**
     * [start description]
     * @param  {[type]} port [description]
     * @return {[type]}      [description]
     */
    start () {
      this.log.debug('Starting AuthenticationService...')
    }
  
    /**
     * [stop description]
     * @return {[type]} [description]
     */
    stop () {}

    /**
     * 
     * @param {*} getUserByUsername 
     * @param {*} validatePassword 
     */
    getStrategy(getUserByUsername, validatePassword) {
        return this.getAuthStrategy(getUserByUsername, validatePassword)
    }
  }
  