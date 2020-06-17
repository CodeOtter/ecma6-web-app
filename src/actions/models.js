import { NotFound } from '../errors/http'

/**
 * 
 * @param {*} getAction 
 */
export const GetRecord = (getAction) => {
    return async (req, res, results) => {
        const id = req.getRoute().id

        return getAction(req.getRoute().id)
    }
}


export const ListRecords = (listAction) => {
    return async (req, res, results) => {
        return listAction(req.param.criteria, req.param.skip, req.param.limit, req.param.sort)
    }
}

/**
 * 
 * @param {*} createAction 
 */
export const CreateRecord = (createAction) => {
    return async (req, res, results) => {
        return createAction(req.body)
    }
}

/**
 * 
 * @param {*} updateAction 
 */
export const UpdateRecord = (updateAction) => {
    return async (req, res, results) => {
        return updateAction(req.getRoute().id, req.body)
    }
}

/**
 * 
 * @param {*} deleteAction 
 */
export const DeleteRecord = (deleteAction) => {
    return async (req, res, results) => {
        return deleteAction(req.getRoute().id)
    }
}
