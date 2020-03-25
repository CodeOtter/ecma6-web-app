import { registerValue } from './container'

require('dotenv').config()

// @SETUP: Define dependency paths here
export const dependencyPaths = [
  'src/services/**/*.js'
]

// @SETUP: Determine order of dependency injection here
export const dependencyOrder = [
  'mongoService',
  'httpService',
  'socketService'
]

// @SETUP: Define a .env file and defined the variables below there
export const mongoUrl = registerValue('mongoUrl', process.env.MONGO_URL)
export const httpPort = registerValue('httpPort', process.env.HTTP_PORT)
export const staticFileDir = registerValue('staticFileDir', process.env.STATIC_FILE_DIR)
