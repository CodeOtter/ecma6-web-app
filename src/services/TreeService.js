import TreeNodeModel from '../models/treeNode'

export default class TreeService {
  constructor ({ LogService }) {
    this.log = LogService
    this.log.debug('TreeService constructed')
  }

  async save (object) {
    return object.save()
  }

  async create (properties) {
    const result = await TreeNodeModel.create(properties)
    return result
  }

  async attach (treeNodeParent, treeNodeChild) {
    treeNodeParent.children.push(treeNodeChild)
    return treeNodeParent.save()
  }

  async copy (targetTreeNode, fromTreeNode, toTreeNode) {
    const index = fromTreeNode.children.indexOf(targetTreeNode)

    if (index === -1) {
      return false
    }

    toTreeNode.children.push(targetTreeNode)

    await toTreeNode.save()

    return {
      target: targetTreeNode,
      from: fromTreeNode,
      to: toTreeNode
    }
  }

  async move (targetTreeNode, fromTreeNode, toTreeNode) {
    const index = fromTreeNode.children.indexOf(targetTreeNode)
    if (index === -1) {
      return false
    }

    fromTreeNode.splice(index, 1)
    toTreeNode.children.push(targetTreeNode)

    await fromTreeNode.save()
    await toTreeNode.save()

    return {
      target: targetTreeNode,
      from: fromTreeNode,
      to: toTreeNode
    }
  }

  async update (id, criteria) {
    const result = await TreeNodeModel.updateOne({
      _id: id,
      ...criteria
    })
    return result
  }

  async delete (id) {
    const result = await TreeNodeModel.deleteOne({
      _id: id
    })
    return result
  }

  async get (id) {
    const result = await TreeNodeModel.findById(id).exec()
    return result
  }

  async find (criteria = {}) {
    const result = await TreeNodeModel.find(criteria)
    return result
  }
}
