require = require('esm')(module)
require('../../src/config')
require('./dependencies')
const { start } = require('../../src/app')

start()
