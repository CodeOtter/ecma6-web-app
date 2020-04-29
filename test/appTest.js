const test = require('ava')
const { resolve } = require('../src/container')

// @SETUP An example of how to test with Ava and how to use testDouble to mock Awilix dependencies

test('some test', async t => {
  await resolve('MongoService').start()
  await resolve('HttpService').start()
  t.pass()
})
