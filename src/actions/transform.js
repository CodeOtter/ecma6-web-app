const funcRegexp = /^function\s+([\w\\$]+)\s*\(/

/**
 *
 * @param {*} array
 */
export function arrayToKeyPair (array) {
  return array.reduce((result, value) => {
    result[value] = value
    return result
  }, {})
}

/**
 *
 */
export function getFunctionName (func) {
  if (func.name) {
    return func.name
  }

  const result = funcRegexp.exec(func.toString())

  return result
    ? result[1]
    : ''
}

/**
 * Flattens an child
 * @param {*} tree
 * @param {*} childName
 * @param {*} valueName
 */
export function flattenTree (tree, childName, valueName) {
  const reducer = (acc, element) => {
    acc.push(element[valueName])
    if (element[childName]) {
      acc = element[childName].reduce(reducer, acc)
    }
    return acc
  }

  return [tree].reduce(reducer, [])
}
