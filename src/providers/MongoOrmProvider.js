import mongoose from 'mongoose'
mongoose.set('useCreateIndex', true)
mongoose.set('autoIndex', true)
mongoose.set('useFindAndModify', false)

/**
 * [MongoOrmProvider description]
 */
function MongoOrmProvider () {
  return mongoose
}

export default MongoOrmProvider
