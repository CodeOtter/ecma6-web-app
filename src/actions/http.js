import {
  BadInput
} from '../errors/http'

const auth = resolve('AuthorizationService')

export function getModelResults (results) {
  return results.GetRecord ||
    results.ListRecords ||
    results.UpdateRecord ||
    results.DeleteRecord || 
    results.CreateRecord
}

/**
  *
  * @param {*} req
  * @param {*} res
  * @param {*} results
  */
export async function PostQueryHasBody (req, res, results) {
  if (req.body === undefined) {
    throw new BadInput('No ID identified')
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} results
 */
export async function GetQueryHasRecordId (req, res, results) {
  if (!req.params || req.params.id === undefined) {
    throw new BadInput('No ID identified')
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} results
 */
export async function JsonOutput (req, res, results) {
  const result = getModelResults(results)

  if (result) {
    return result
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} results
 */
export async function ErrorOutput (req, res, results) {
  const error = results.Error

  if (error) {
    return {
      status: error.status,
      error
    }
  }
}

/**
  *
  * @param {*} req
  * @param {*} res
  * @param {*} results
  */
 export const SanitizeFields = (validationSchema) => {
  return async function SanitizeFields (req, res, results) {

    const isGet = req.method === 'GET'

    const data = isGet
      ? req.query
      : req.body

    const result = await auth.filterFields(req.account, data, validationSchema, true)

    if (isGet) {
      req.originalQuery = req.query
      req.query = result
    } else {
      req.originalBody = req.body
      req.body = result
    }
  }
}

/**
 * 
 * @param {*} fields 
 */
export const ShapeResults = (validationSchema) => {
  return async function ShapeResults (req, res, results) {
    let result

    const data = getModelResults(results)

    if (data instanceof Array) {
      result = []

      for (const item of data) {
        result.push(await auth.filterFields(req.account, data, validationSchema, false))
      }
    } else {
      result = await auth.filterFields(req.account, data, validationSchema, false)
    }

    return result
  }
}