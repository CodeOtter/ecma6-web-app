import mongoose from 'mongoose'
import { TreeNodeSchema } from './treeNode'
const Schema = mongoose.Schema

function setDisplayName () {
  return !this.displayName
    ? this.name
    : this.displayName
}

export const AccountSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  displayName: {
    type: String,
    default: setDisplayName
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  roles: {
    type: [TreeNodeSchema],
    default: []
  },
  createdByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  },
  permissions: {
    type: Map,
    of: Buffer
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedByAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  }
}, {
  strict: true
})

const AccountModel = mongoose.model('Account', AccountSchema)

export default AccountModel
