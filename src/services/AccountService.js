import ModelService from './ModelService'
import AccountModel from '../models/account'

export default class AccountService extends ModelService {
  constructor ({ LogService, AuthorizationService }) {
    console.log('>> AccountService constructor', AccountModel.find)
    super(LogService, AccountModel)
    this.auth = AuthorizationService
    this.log.debug('AccountService constructed')
  }

  /**
   * Creates a TreeNode
   * @param {String} name
   * @param {String} displayName
   * @param {Account[]} children
   */
  async create ({ name, displayName, status, createdByAccount, roles, permissions }) {
    return super.create({
      name,
      displayName,
      status,
      createdByAccount,
      roles,
      permissions: this.auth.getPermissionsFromJson(permissions)
    })
  }
}
