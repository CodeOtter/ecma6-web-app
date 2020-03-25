const { Lifetime } = require('awilix')
const { resolve } = require('../../../src/container')
const td = require('testdouble')

const factory = () => {
  const service = resolve('mongoService', {
    lifetime: Lifetime.TRANSIENT
  })

  // @SETUP: Add methods you need to mock for MongoService here
  td.replace(service, 'start')
  td.replace(service, 'start')

  return service
}

module.exports = factory
