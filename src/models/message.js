import mongoose from 'mongoose'

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

export default Message
