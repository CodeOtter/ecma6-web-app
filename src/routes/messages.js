import { resolve } from '../container'
import Message from '../models/message'

const http = resolve('HttpService')
const socket = resolve('SocketService')
const log = resolve('LogService')

/**
 * [description]
 * @param  {[type]} '/messages' [description]
 * @param  {[type]} (req,       res)          [description]
 * @param  {[type]} (err,       messages      [description]
 * @return {[type]}             [description]
 */
http.router.get('/messages', (req, res, next) => {
  Message.find({}, (err, messages) => {
    if (err) {
      log.error(err)
    }

    res.send(messages)
    return next()
  })
})

/**
 * [description]
 * @param  {[type]} '/messages' [description]
 * @param  {[type]} (req,       res)          [description]
 * @return {[type]}             [description]
 */
http.router.post('/messages', (req, res, next) => {
  const message = new Message(req.body)
  log.info(req.body)
  message.save((err) => {
    if (err) {
      res.status(500)
    } else {
      socket.instance.emit('message', req.body)
      res.status(200)
    }
    return next()
  })
})
