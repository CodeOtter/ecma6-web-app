import ModelService from './ModelService'
import AccountModel from '../models/account'

export default class AccountService extends ModelService {
  constructor ({ LogService }) {
    super(LogService, AccountModel)
    this.log.debug('AccountService constructed')
  }

  /**
   * Creates a TreeNode
   * @param {String} name
   * @param {String} displayName
   * @param {Account[]} children
   */
  async create (name, displayName) {
    return super.create({
      name,
      displayName
    })
  }
}
