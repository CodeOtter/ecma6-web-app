import ModelService from './ModelService'
import AccountModel from '../models/account'
import {
  pass,
  fieldIsNotEmpty,
  requesterIsAdmin
} from '../filters'
export default class AccountService extends ModelService {
  constructor ({ LogService, AuthorizationService }) {
    super(LogService, AccountModel)
    this.auth = AuthorizationService
    this.log.debug('AccountService constructed')
  }
}
