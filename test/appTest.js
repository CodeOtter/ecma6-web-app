const test = require('ava')
const { resolve } = require('../src/container')

// @SETUP An example of how to test with Ava and how to use testDouble to mock Awilix dependencies

test.before(async t => {
  try {
    await resolve('HttpService').start()
  } catch (e) {
    console.error(e)
    throw e
  }
})

test('Setting up global app prerequisites', t => {
  t.is(true, true)
})
