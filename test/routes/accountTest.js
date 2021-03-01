const test = require('ava')
const http = require('ava-http')
const { resolve } = require('../../src/container')

test.before(async t => {
  const HttpService = resolve('HttpService')
  await resolve('HttpService').start()
  t.context.url = `http://localhost:${HttpService.getPort()}`
})

test('Creating an Account via HTTP routes', async t => {
  try {
    const account = await http.post(`${t.context.url}/accounts`, {
      body: {
        name: 'test dude',
        displayName: 'The Test Dude'
      }
    })

    t.is(account.status, 'active')
    t.is(account.createdByAccount, null)
    t.is(account.deletedAt, null)
    t.is(account.deletedByAccount, null)
    t.is(account._id.length > 10, true)
    t.is(account.name, 'test dude')
    t.is(account.displayName, 'The Test Dude')
    t.is(account.roles.length, 0)
  } catch (e) {
    console.error(e)
    t.fail()
  }
})
