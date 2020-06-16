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
  async create (name, description, type, createdByAccount, ancestors, meta) {
    if (!(meta instanceof Map)) {
      if (typeof meta === 'object') {
        meta = new Map(Object.entries(meta))
      } else {
        meta = new Map()
      }
    }

    meta.forEach((value, key) => {
      if(value instanceof Array) {
        meta.set(key, Buffer.from(value))
      }
    })

    return super.create({
      name,
      description,
      type,
      ancestors: mapAncestors(ancestors),
      createdByAccount,
      meta
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
    return this.create(newName, treeNode.description, treeNode.type, createdByAccount, treeNode.ancestors, treeNode.meta)
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

  /**
   * 
   * @param {*} treeNode 
   * @param {*} name 
   * @param {*} slot 
   * @param {*} value 
   */
  async hasMeta (treeNode, name, slot, value, meta) {
    const inheritedMeta = await this.inheritMeta(treeNode, meta)
    return inheritedMeta.get(name)[slot] === value
  }

  /**
   * 
   * @param {*} treeNode 
   * @param {*} meta 
   */
  async inheritMeta (treeNode, meta) {
    const result = meta || new Map()

    // Copy the initial meta
    treeNode.meta.forEach((value, key) => {
      result.set(key, Buffer.alloc(value.length))
      value.copy(result.get(key))
    })

    const reversedAncestors = [...treeNode.ancestors].reverse()

    // Move backwards through all ancestors for proper inheritance representation
    for (const ancestor of reversedAncestors) {
      let ancestorMeta

      // Get the ancestorMeta regardless of the treeNode state
      if (!ancestor.meta) {
        const id = typeof ancestor === 'string'
          ? ancestor
          : ancestor._id.toString()

        const fetchedAncestor = await super.getActive(id)
        if (fetchedAncestor) {
          ancestorMeta = fetchedAncestor.meta
        } else {
          ancestorMeta = ancestor.meta  
        }
      } else {
        ancestorMeta = ancestor.meta
      }

      // Check each buffer and write only when the slot hasn't been written to
      ancestorMeta.forEach((ancestorValue, key) => {
        let ancestorBuffer = ancestorValue
        let resultBuffer = result.get(key)

        if (resultBuffer) {
          // The ancestorValue has been merged with an ancestor
          if (ancestorValue.length !== result.get(key).length) {
            const newSize = ancestorValue.length >= result.get(key).length
              ? ancestorValue.length
              : result.get(key).length

            // Readjust for a new buffer size
            ancestorBuffer = Buffer.alloc(newSize)
            resultBuffer = Buffer.alloc(newSize)
            result.get(key).forEach((value, i) => {
              resultBuffer[i] = value
            })

            for (var k = 0; k < newSize; k++) {
              if (ancestorValue[k]) {
                // Copy over the old ancestorValue to the new buffer
                ancestorBuffer[k] = ancestorValue[k]
              } else {
                // Set the extended slot to 0
                ancestorBuffer[k] = 0
              }
            }
          }

          for (var i = 0; i < resultBuffer.length; i++) {
            if (resultBuffer[i] === 0 || resultBuffer[i] === undefined) {
              // Allow the ancestor to overwrite when the result is zero
              resultBuffer[i] = ancestorBuffer[i]
            }
          }
        } else {
          // Copy the ancestor value over to the result buffer
          resultBuffer = Buffer.alloc(ancestorValue.length)
          ancestorValue.copy(resultBuffer)
        }

        result.set(key, resultBuffer)
      })
    }

    return result
  }
}
