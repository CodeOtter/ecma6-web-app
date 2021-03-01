export default class LogService {
  /**
   * [info description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  info (message) {
    console.info(message)
  }

  /**
   * [error description]
   * @param  {[type]} messasge [description]
   * @return {[type]}          [description]
   */
  error (message) {
    console.error(message)
  }

  /**
   * [debug description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  debug (message) {
    console.debug(message)
  }

    /**
   * [silly description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  silly (message) {
    console.debug(message)
  }
}
