/**
 *
 * @param {*} array
 */
export const arrayToKeyPair = (array) => {
  return array.reduce((result, value) => {
    result[value] = value
    return result
  }, {})
}
