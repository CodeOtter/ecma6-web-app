import { resolve } from '../container'
import {
  JsonOutput,
  PostQueryHasBody,
  GetQueryHasRecordId
} from '../actions/http'
import {
  GetRecord,
  ListRecords,
  CreateRecord,
  UpdateRecord,
  DeleteRecord,
  DoesRecordExist
} from '../actions/models'
import {
  AccountInput,
  AccountOutput,
  AccountListOutput
} from '../actions/accounts'

const http = resolve('HttpService')
const accountService = resolve('AccountService')

export const endpoint = 'accounts'

http.getOne(endpoint, [
  GetQueryHasRecordId,
  GetRecord(accountService),
  DoesRecordExist(accountService),
  AccountOutput,
  JsonOutput
])

http.get(endpoint, [
  ListRecords(accountService),
  AccountListOutput,
  JsonOutput
])

http.post(endpoint, [
  PostQueryHasBody,
  AccountInput,
  CreateRecord(accountService, 'AccountInput'),
  AccountOutput,
  JsonOutput
])

http.patch(endpoint, [
  GetQueryHasRecordId,
  PostQueryHasBody,
  DoesRecordExist(accountService),
  AccountInput,
  UpdateRecord(accountService, 'AccountInput'),
  AccountOutput,
  JsonOutput
])

http.delete(endpoint, [
  GetQueryHasRecordId,
  DoesRecordExist(accountService),
  DeleteRecord(accountService),
  AccountOutput,
  JsonOutput
])
