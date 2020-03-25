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
http.express.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) {
      log.error(err)
    }

    res.send(messages)
  })
})

/**
 * [description]
 * @param  {[type]} '/messages' [description]
 * @param  {[type]} (req,       res)          [description]
 * @return {[type]}             [description]
 */
http.express.post('/messages', (req, res) => {
  const message = new Message(req.body)
  log.info(req.body)
  message.save((err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      socket.instance.emit('message', req.body)
      res.sendStatus(200)
    }
  })
})
