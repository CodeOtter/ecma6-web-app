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
   * getStrategy
   * @param {*} getUserByUsername
   * @param {*} validatePassword
   */
  getStrategy (getUserByUsername, validatePassword) {
    return this.getAuthStrategy(getUserByUsername, validatePassword)
  }
}
