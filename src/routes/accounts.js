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
  DeleteRecord
} from '../actions/models'

const http = resolve('HttpService')
const accountService = resolve('AccountService')

export const endpoint = 'accounts'

http.getOne(endpoint, [
  GetQueryHasRecordId,
  GetRecord(accountService),
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
  UpdateRecord(accountService),
  JsonOutput
])

http.delete(endpoint, [
  GetQueryHasRecordId,
  DeleteRecord(accountService),
  JsonOutput
])
