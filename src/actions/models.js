/**
 *
 * @param {*} getAction
 */
export const GetRecord = (service) => {
  return async function GetRecord (req, res, results) {
    return service.getActive(req.getRoute().id)
  }
}

export const ListRecords = (service) => {
  return async function ListRecords (req, res, results) {
    return service.listActive(req.query.criteria, req.query.skip, req.query.limit, req.query.sort)
  }
}

/**
 *
 * @param {*} createAction
 */
export const CreateRecord = (service) => {
  return async function CreateRecord (req, res, results) {
    return service.create(req.body)
  }
}

/**
 *
 * @param {*} updateAction
 */
export const UpdateRecord = (service) => {
  return async function UpdateRecord (req, res, results) {
    return service.update(req.getRoute().id, req.body)
  }
}

/**
 *
 * @param {*} deleteAction
 */
export const DeleteRecord = (service) => {
  return async function DeleteRecord (req, res, results) {
    return service.delete(req.getRoute().id)
  }
}
