import {
  pass,
  fieldIsNotEmpty
} from '../filters'

const auth = resolve('AuthorizationService')

/**
 * 
 * @param {*} account 
 * @param {*} record 
 */
async function prepareOutput (account, record) {
  return auth.filterFields(account, getModelResults(record), {
    name: pass,
    displayName: pass,
    status: pass,
    createdByAccount: pass,
    roles: pass,
    permissions: pass
  })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} results 
 */
export async function AccountInput (req, res, results) {
  const isAdmin = await requesterIsAdmin(req.account)

  const status = isAdmin
    ? req.body.status
    : 'pending'

  const status = isAdmin
    ? req.body.createdByAccount
    : req.account

  const roles = isAdmin
    ? req.body.roles
    : []

  const roles = isAdmin
    ? this.auth.getPermissionsFromJson(req.body.permissions)
    : {}

  const data = {
    name: req.body.name,
    displayName: req.body.displayName,
    status,
    createdByAccount,
    roles,
    permissions
  }

  return auth.filterFields(req.account, data, {
    name: fieldIsNotEmpty,
    displayName: fieldIsNotEmpty,
    status: fieldIsNotEmpty,
    createdByAccount: fieldIsNotEmpty,
    roles: fieldIsNotEmpty,
    permissions: fieldIsNotEmpty
  })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} results 
 */
export async function AccountOutput (req, res, results) {
  const record = results.ListRecords ||
    results.UpdateRecord ||
    results.DeleteRecord || 
    results.CreateRecord
  
  return prepareOutput(req.account, record)
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} results 
 */
export async function AccountListOutput (req, res, results) {
  const records = []

  for (const record of results.ListRecords) {
    records.push(await prepareOutput(req.account, record))
  }
}

