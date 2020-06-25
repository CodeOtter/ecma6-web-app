import {
  BadInput
} from '../errors/http'

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
  const result = results.GetRecord ||
    results.ListRecords ||
    results.PostRecord ||
    results.UpdateRecord ||
    results.DeleteRecord || 
    results.CreateRecord

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
