const test = require('ava')
const HttpService = require('./mocks/services/HttpService')

// @SETUP An example of how to test with Ava and how to use testDouble to mock Awilix dependencies

test('some test', t => {
  console.log(HttpService())
  t.pass()
})
