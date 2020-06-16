import ModelService from './ModelService'
import TreeNodeModel from '../models/treeNode'

/**
 * 
 * @param {*} ancestors 
 */
function mapAncestors (ancestors) {
  if (typeof ancestors === 'string') {
    // Convert strings
    if (ancestors.indexOf(',') > -1) {
      return [this.orm.Types.ObjectId(ancestors)]
    } else {
      return ancestors.split(',').map(this.orm.Types.ObjectId)
    }
  } else if (ancestors instanceof Array) {
    // Convert array of objects to just their IDs
    const formattedAncestors = []

    for (const ancestor of ancestors) {
      if (ancestor._id) {
        formattedAncestors.push(ancestor)
      } else {
        formattedAncestors.push(this.orm.Types.ObjectId(ancestor))
      }
    }

    return formattedAncestors
  } else if (typeof ancestors === 'object' && ancestors.ancestors){
    // Take the ancestors of the ancestor
    const formattedAncestors = []

    for (const ancestor of ancestors.ancestors) {
      if (ancestor._id) {
        formattedAncestors.push(ancestor)
      } else {
        formattedAncestors.push(this.orm.Types.ObjectId(ancestor))
      }
    }

    if (typeof ancestors._id === 'object') {
      formattedAncestors.push(ancestors._id)
    } else {
      formattedAncestors.push(this.orm.Types.ObjectId(ancestors._id))
    }
    
    return formattedAncestors
  }
}

export default class TreeService extends ModelService {
  constructor ({ LogService, MongoOrmProvider }) {
    super(LogService, TreeNodeModel)
    this.orm = MongoOrmProvider
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
  async create (name, description, type, createdByAccount, ancestors) {
    return super.create({
      name,
      description,
      type,
      ancestors: mapAncestors(ancestors),
      createdByAccount
    })
  }

  /**
   * Attaches a TreeNode as a child to another TreeNode
   * @param {TreeNode} treeNodeParent
   * @param {TreeNode} treeNodeChild
   */
  async attach (treeNodeParent, treeNodeChild) {
    treeNodeChild.ancestors = mapAncestors(treeNodeParent)
    return treeNodeChild.save()
  }

  /**
   * Attaches a TreeNode as a child to another TreeNode
   * @param {TreeNode} treeNodeParent
   * @param {TreeNode} treeNodeChild
   */
  async detach (treeNodeParent, treeNodeChild) {
    const indexOf = treeNodeChild.ancestors.findIndex(ancestor => 
      ancestor._id === treeNodeParent || ancestor._id === treeNodeParent._id
    )

    if (indexOf > -1) {
      treeNodeChild.ancestors.splice(indexOf)
    } else {
      return false
    }
    return treeNodeChild.save()
  }

  /**
   * Makes a TreeNode a sibling of another
   * @param {TreeNode} targetTreeNode
   * @param {TreeNode} fromTreeNode
   * @param {TreeNode} toTreeNode
   */
  async siblingify (treeNode, ofTreeNode) {
    treeNode.ancestors = ofTreeNode.ancestors
    return treeNode.save()
  }

  /**
   * Copy a node
   * @param {*} treeNode 
   * @param {*} newName 
   * @param {*} createdByAccount 
   */
  async copy (treeNode, newName, createdByAccount) {
    return this.create(newName, treeNode.description, treeNode.type, createdByAccount, treeNode.ancestors)
  }

  /**
   * Moves a TreeNode to be a child of a TreeNode
   * @param {TreeNode} targetTreeNode
   * @param {TreeNode} fromTreeNode
   * @param {TreeNode} toTreeNode
   */
  async move (fromTreeNode, toTreeNode) {
    fromTreeNode.ancestors = toTreeNode.ancestors
    fromTreeNode.ancestors.push(toTreeNode._id)
    return fromTreeNode.save()

  }
}
