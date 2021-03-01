import { container } from './container'

const appService = container.resolve('AppService')

/**
 * [start description]
 * @return {[type]} [description]
 */
export async function start () {
  return appService.start()
}