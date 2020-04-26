import mongoose from 'mongoose'
import { arrayToKeyPair } from '../actions/transform'
const Schema = mongoose.Schema

export const autoPopulate = (next) => {
  this.populate('children')
  this.populate('createdByAccount')
  this.populate('deletedByAccount')
  next()
}

const TreeNodeTypeList = [
  'base'
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
  deletedAt: Date,
  type: {
    type: String,
    enum: TreeNodeTypeList
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'TreeNode'
  }],
  createdByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  deletedByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
}, {
  strict: true
})
  .pre('findOne', autoPopulate)
  .pre('find', autoPopulate)

const TreeNodeModel = mongoose.model('TreeNode', TreeNodeSchema)

export default TreeNodeModel
