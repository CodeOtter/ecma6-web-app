const test = require('ava')
const { resolve } = require('../src/container')
const { TreeNodeTypes } = require('../src/models/treeNode')

test.before(async t => {
  t.context = {
    mongoDb: await resolve('MongoService').start(),
    accountService: resolve('AccountService'),
    treeService: resolve('TreeService')
  }
})

test('Creating a TreeNode', async t => {
  const treeService = t.context.treeService
  const accountService = t.context.accountService
  const account = await accountService.create('Alice')
  const treeNode = await treeService.create('TreeNode 1', 'A lone treeNode', TreeNodeTypes.standard, account)
  const treeNodeObject = treeNode.toObject()
  t.is(treeNodeObject.name, 'TreeNode 1')
  t.is(treeNodeObject.description, 'A lone treeNode')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), account._id.toString())
})
