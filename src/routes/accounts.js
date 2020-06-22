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
  GetRecord(accountService.get),
  JsonOutput
])

http.get(endpoint, [
  ListRecords(accountService.update),
  JsonOutput
])
http.router.post('/accounts', (req, res, next) => {
  const message = new Message(req.body)
  log.info(req.body)
  message.save((err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      socket.instance.emit('message', req.body)
      res.sendStatus(200)
    }
    return next()
  })
})
/*
http.router.post('/accounts', (req, res, next) => {
  this.log.silly('pew')
  return next()
})
*/

/*
http.post(endpoint, [
  PostQueryHasBody,
  CreateRecord(accountService.create),
  JsonOutput
])
*/
http.patch(endpoint, [
  GetQueryHasRecordId,
  PostQueryHasBody,
  UpdateRecord(accountService.update),
  JsonOutput
])

http.delete(endpoint, [
  GetQueryHasRecordId,
  DeleteRecord(accountService.delete),
  JsonOutput
])
