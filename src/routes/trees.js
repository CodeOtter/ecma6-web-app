import { resolve } from '../container'

const http = resolve('HttpService')
const TreeService = resolve('TreeService')
// const socket = resolve('SocketService')
const log = resolve('LogService')

/**
 * [description]
 * @param  {[type]} '/messages' [description]
 * @param  {[type]} (req,       res)          [description]
 * @param  {[type]} (err,       messages      [description]
 * @return {[type]}             [description]
 */
http.router.get('/trees/byId/:id', async (req, res) => {
  const id = req.getRoute().id
  try {
    const treeNode = await TreeService.get(id)

    if (!treeNode) {
      res.send(404)
    } else {
      res.json(treeNode)
    }
  } catch (e) {
    log.error(e)
    res.send(400, e)
  }
})
