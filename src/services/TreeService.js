import ModelService from './ModelService'
import TreeNodeModel from '../models/treeNode'
import AccountModel from '../models/account'
import { flattenTree } from '../actions/transform'

const projection = {
  name: 1,
  description: 1,
  deletedAt: 1,
  type: 1,
  parent: 1,
  createdByAccount: 1,
  deletedByAccount: 1
}

function getAggregate (criteria, limit) {
  return TreeNodeModel.aggregate([
    { $limit: limit },
    { $match: criteria },
    {
      $lookup: {
        from: 'accounts',
        localField: 'createdByAccount',
        foreignField: '_id',
        as: 'createdByAccount'
      }
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'deletedByAccount',
        foreignField: '_id',
        as: 'deletedByAccount'
      }
    },
    {
      $graphLookup: {
        from: 'treeNodes',
        startWith: '$parent',
        connectFromField: 'parent',
        connectToField: '_id',
        as: 'children'
      }
    },
    {
      $project: {
        ...projection,
        children: 1,
        createdByAccount: { $arrayElemAt: ['$createdByAccount', 0] },
        deletedByAccount: { $arrayElemAt: ['$deletedByAccount', 0] }
      }
    }
  ])
}

async function aggregateWrapper (accessor, readOnly) {
  if (!readOnly) {
    const aggregate = await accessor.exec()
    console.log('aggregate', aggregate)
    const result = new TreeNodeModel(aggregate[0])

    const createdByAccount = aggregate[0].createdByAccount
      ? new AccountModel(aggregate[0].createdByAccount)
      : null
    const deletedByAccount = aggregate[0].deletedByAccount
      ? new AccountModel(aggregate[0].deletedByAccount)
      : null

    result.createdByAccount = createdByAccount
    result.deletedByAccount = deletedByAccount

    return result
  } else {
    return accessor.exec()
  }
}

export default class TreeService extends ModelService {
  constructor ({ LogService }) {
    super(LogService, TreeNodeModel)
    this.log.debug('TreeService constructed')
  }

  /**
   * Creates a TreeNode
   * @param {String} name
   * @param {String} description
   * @param {String} type
   * @param {Account} createdByAccount
   * @param {TreeNode[]} children
   */
  async create (name, description, type, createdByAccount, children) {
    return super.create({
      name,
      description,
      type,
      children,
      createdByAccount
    })
  }

  async get (id, readOnly = false) {
    const aggregate = getAggregate({ _id: id }, 1)
    return aggregateWrapper(aggregate, readOnly)
  }

  /**
   * Attaches a TreeNode as a child to another TreeNode
   * @param {TreeNode} treeNodeParent
   * @param {TreeNode} treeNodeChild
   */
  async attach (treeNodeParent, treeNodeChild) {
    treeNodeChild.parent = treeNodeParent._id
    console.log('treeNodeChild', treeNodeChild)
    return treeNodeChild.save()
    /*
    treeNodeParent.children.push(treeNodeChild)
    await treeNodeParent.save()
    await TreeNodeModel.deleteOne({
      _id: treeNodeChild._id
    })
    return true
    */
  }

  /**
   * Attaches a TreeNode as a child to another TreeNode
   * @param {TreeNode} treeNodeParent
   * @param {TreeNode} treeNodeChild
   */
  async detach (treeNodeParent, treeNodeChild) {
    const record = treeNodeParent.children.pull({
      _id: treeNodeChild._id
    })

    if (record) {
      record.remove()
      await treeNodeParent.save()
      return treeNodeChild.save()
    } else {
      return false
    }
  }

  /**
   * Copies a TreeNode child from one TreeNode to another
   * @param {TreeNode} targetTreeNode
   * @param {TreeNode} fromTreeNode
   * @param {TreeNode} toTreeNode
   */
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

  /**
   * Moves a TreeNode child from one TreeNode to another
   * @param {TreeNode} targetTreeNode
   * @param {TreeNode} fromTreeNode
   * @param {TreeNode} toTreeNode
   */
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

  /**
   * Gets a list of all TreeNode children IDs
   * @param {*} id
   */
  async getTreeIdMap (id) {
    const tree = await TreeNodeModel.findById(id).lean()
    const result = flattenTree(tree, 'children', '_id')
    return result
  }
}
