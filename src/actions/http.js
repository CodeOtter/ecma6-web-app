import { 
    BadInput
 } from '../errors/http'

 /**
  * 
  * @param {*} req 
  * @param {*} res 
  * @param {*} results 
  */
export const PostQueryHasBody = async (req, res, results) => {
    if (req.body === undefined) {
        throw new BadInput(`No ID identified`)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} results 
 */
export const GetQueryHasRecordId = async (req, res, results) => {
    if (req.getRoute().id === undefined) {
        throw new BadInput(`No ID identified`)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} results 
 */
export const JsonOutput = async (req, res, results) => {
    const result = results.GetRecord
        || results.ListRecords
        || results.PostRecord
        || results.UpdateRecord
        || results.DeleteRecord

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
export const ErrorOutput = async (req, res, results) => {
    const error = results.Error

    if (error) {
        return {
            status: error.status,
            error
        }
    }
}
