import {
  NotFound,
  ServerError,
  Conflict,
  BadInput
} from '../errors/http'

const extractRecord = async (service, id, results, fetch = true) => {
  if (results.GetRecord && results.GetRecord._id === id) {
    return results.GetRecord
  } else if (results.ListRecords) {
    const record = results.ListRecords.find(record => record._id === id)
    if (record) {
      return record
    }
  }

  if (fetch) {
    return await service.getActive(id)
  } else {
    return await service.exists(id)
  }
}


/**
 *
 * @param {*} modelService
 */
export const GetRecord = (service) => {
  return async function GetRecord (req, res, results) {
    try {
      return await extractRecord(service, req.params.id, results)
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadInput(e)
      } else {
        throw new ServerError(e)
      }
    }
  }
}

/**
 *
 * @param {*} modelService
 */
export const DoesRecordExist = (service) => {
  return async function DoesRecordExists (req, res, results) {
    const id = req.params.id
    try {
      const exists = await extractRecord(service, id, results, false)

      if (!exists) {
        throw new NotFound(`${id} not found`)
      } else {
        return exists
      }
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadInput(e)
      } else {
        throw new ServerError(e)
      }
    }
  }
}

export const ListRecords = (service) => {
  return async function ListRecords (req, res, results) {
    try {
      return await service.listActive(req.query.criteria, req.query.skip, req.query.limit, req.query.sort)
    } catch (e) {
      throw new ServerError(e)
    }
  }
}

/**
 *
 * @param {*} modelService
 */
export const CreateRecord = (service) => {
  return async function CreateRecord (req, res, results) {
    try {
      return await service.create(req.body)
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadInput(e)
      } else if (e.code === 11000) {
        throw new Conflict(e)
      } else {
        throw new ServerError(e)
      }
    }
  }
}

/**
 *
 * @param {*} modelService
 */
export const UpdateRecord = (service) => {
  return async function UpdateRecord (req, res, results) {
    try {
      return await service.update(req.params.id, req.body)
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadInput(e)
      } else if (e.code === 11000) {
        throw new Conflict(e)
      } else {
        throw new ServerError(e)
      }
    }
  }
}

/**
 *
 * @param {*} modelService
 */
export const DeleteRecord = (service) => {
  return async function DeleteRecord (req, res, results) {
    try {
      return await service.delete(req.params.id)
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadInput(e)
      } else {
        throw new ServerError(e)
      }
    }
  }
}
