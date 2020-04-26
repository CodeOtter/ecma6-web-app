import mongoose from 'mongoose'

mongoose.set('autoIndex', false)

/**
 * [MongoOrmProvider description]
 */
function MongoOrmProvider () {
  return mongoose
}

export default MongoOrmProvider
