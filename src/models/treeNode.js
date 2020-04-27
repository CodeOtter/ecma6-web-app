import mongoose from 'mongoose'
import { arrayToKeyPair } from '../actions/transform'
const Schema = mongoose.Schema

export function autoPopulate (next) {
  this.populate('children')
  this.populate('createdByAccount')
  this.populate('deletedByAccount')
  next()
}

const TreeNodeTypeList = [
  'standard'
]
export const TreeNodeTypes = arrayToKeyPair(TreeNodeTypeList)

export const TreeNodeSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  deletedAt: {
    type: Date,
    default: null
  },
  type: {
    type: String,
    enum: TreeNodeTypeList,
    required: true
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'TreeNode',
    default: []
  }],
  createdByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  deletedByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  }
}, {
  strict: true
})
  .pre('findOne', autoPopulate)
  .pre('find', autoPopulate)

const TreeNodeModel = mongoose.model('TreeNode', TreeNodeSchema)

export default TreeNodeModel
