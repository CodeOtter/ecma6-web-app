const test = require('ava')
const http = require('ava-http')
const { resolve } = require('../../src/container')

const host = 'http://localhost:3000'

test.before(async t => {
  await resolve('HttpService').start()
})

test('Creating an Account via HTTP routes', async t => {
  try {
    const account = await http.post(`${host}/accounts`, {
      body: {
        name: 'test dude',
        displayName: 'The Test Dude'
      }
    })

    console.log(account)
  } catch (e) {
    console.log(e.name)
    console.log(e.options)
    console.log(e.statusCode)
    console.log(e.message)
    console.log(e.error)
    t.fail()
  }
})
