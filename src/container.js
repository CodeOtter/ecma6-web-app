import {
  asClass,
  asFunction,
  asValue,
  createContainer
} from 'awilix'

export const container = createContainer()

/**
 * [registerClass description]
 * @param  {[type]} name       [description]
 * @param  {[type]} definition [description]
 * @param  {String} mode       [description]
 * @return {[type]}            [description]
 */
export function registerClass (name, definition, mode = 'singleton') {
  container.register({
    [name]: asClass(definition)[mode]()
  })

  return () => {
    return container.resolve(name)
  }
}

/**
 * [registerAction description]
 * @param  {[type]} name       [description]
 * @param  {[type]} definition [description]
 * @param  {String} mode       [description]
 * @return {[type]}            [description]
 */
export function registerAction (name, definition, mode = 'singleton') {
  container.register({
    [name]: asFunction(definition)[mode]()
  })

  return container.cradle[name]
}

/**
 * [registerValue description]
 * @param  {[type]} name  [description]
 * @param  {[type]} value [description]
 * @param  {String} mode  [description]
 * @return {[type]}       [description]
 */
export function registerValue (name, value) {
  container.register({
    [name]: asValue(value)
  })

  return container.cradle[name]
}

/**
 * [getScope description]
 * @return {[type]} [description]
 */
export function getScope () {
  return container.createScope()
}

/**
 * [resolve description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export function resolve (name) {
  return container.resolve(name)
}
