import { resolve } from '../container'

const http = resolve('HttpService')
const TreeService = resolve('TreeService')
// const socket = resolve('SocketService')
const log = resolve('LogService')

export const endpoint = 'treeNodes'

/**
 * Attaches a TreeNode as a child to another TreeNode
 * @param {TreeNode} treeNodeParent
 * @param {TreeNode} treeNodeChild
 */
http.router.get(`/${endpoint}/:id`, async (req, res) => {
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
