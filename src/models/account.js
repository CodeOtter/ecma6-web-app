import mongoose from 'mongoose'
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
  }
}, {
  strict: true
})

const AccountModel = mongoose.model('Account', AccountSchema)

export default AccountModel
