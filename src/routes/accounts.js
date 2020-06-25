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

const http = resolve('HttpService')
const accountService = resolve('AccountService')

export const endpoint = 'accounts'

http.getOne(endpoint, [
  GetQueryHasRecordId,
  GetRecord(accountService),
  DoesRecordExist(accountService),
  JsonOutput
])

http.get(endpoint, [
  ListRecords(accountService),
  JsonOutput
])

http.post(endpoint, [
  PostQueryHasBody,
  CreateRecord(accountService),
  JsonOutput
])

http.patch(endpoint, [
  GetQueryHasRecordId,
  PostQueryHasBody,
  DoesRecordExist(accountService),
  UpdateRecord(accountService),
  JsonOutput
])

http.delete(endpoint, [
  GetQueryHasRecordId,
  DoesRecordExist(accountService),
  DeleteRecord(accountService),
  JsonOutput
])
