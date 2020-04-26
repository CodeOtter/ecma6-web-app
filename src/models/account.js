import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const AccountSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    default: ''
  },
  displayName: {
    type: String,
    default: ''
  }
}, {
  strict: true
})

const AccountModel = mongoose.model('Account', AccountSchema)

export default AccountModel
