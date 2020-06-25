import {
    NotFound,
    ServerError,
    Conflict,
    BadInput
} from '../errors/http'

const auth = resolve('AuthorizationService')

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
function idsMatch(account, data) {
  if (!account || !data) {
    return false
  }

  return data._id.toString() === account._id.toString()
}

/**
 * 
 * @param {*} value 
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * 
 * @param {*} value 
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * 
 * @param {\} object 
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function recordIsCreatedBy (account, data) {
  return idsMatch(account, data.createdByAccount)
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function recordIsDeletedBy (account, data) {
  return idsMatch(account, data.deletedByAccount)
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function recordIsDeleted (account, data) {
  if (!data) {
    return false
  }

  return data.deletedByAccount !== null
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function recordExists (account, data) {
  if (!data) {
    return false
  }

  return !!data._id
}


/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function requesterIsLoggedIn (account, data) {
  return !!account
}

export async function requesterIsAdmin (account, data) {
  if (!account) {
    return false
  }

  return account.role === 'admin' // @TODO some up with configuable permissions
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function requesterIsActive (account, data) {
  if (!account) {
    return false
  }

  return account.status === 'active'
}

/**
 * 
 * @param {*} account 
 * @param {*} data 
 */
export async function isFieldEmpty (account, data, value, fieldName) {
  if (data === undefined || data === null) {
    return true
  }

  if (isArrayLike(value) && (value instanceof Array || typeof value == 'string' || typeof value.splice == 'function' || value instanceof Buffer)) {
    return !value.length;
  }

  if (value instanceof Map || value instanceof Set) {
    return !value.size;
  }

  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }

  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return false
}
