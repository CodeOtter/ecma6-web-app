import ModelService from './ModelService'
import TreeNodeModel from '../models/treeNode'
import { flattenTree } from '../actions/transform'

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

  /**
   * Attaches a TreeNode as a child to another TreeNode
   * @param {TreeNode} treeNodeParent
   * @param {TreeNode} treeNodeChild
   */
  async attach (treeNodeParent, treeNodeChild) {
    treeNodeParent.children.push(treeNodeChild)
    return treeNodeParent.save()
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
