const test = require('ava')
const http = require('ava-http')
// const { resolve } = require('../src/container')

const host = 'http://localhost:3000'

/*
test.before(async t => {
  t.context = {
    mongoDb: await resolve('MongoService').start(),
  }
})
*/
test('Creating an Account via HTTP routes', async t => {
  try {
    const account = await http.post(`${host}/accounts`, {})
    console.log(account)
  } catch (e) {
      console.error(e)
  }
})
