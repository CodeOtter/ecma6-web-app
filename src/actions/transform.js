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

/**
 * Flattens an child
 * @param {*} tree
 * @param {*} childName
 * @param {*} valueName
 */
export const flattenTree = (tree, childName, valueName) => {
  const reducer = (acc, element) => {
    acc.push(element[valueName])
    if (element[childName]) {
      acc = element[childName].reduce(reducer, acc)
    }
    return acc
  };

  return [tree].reduce(reducer, [])
}
