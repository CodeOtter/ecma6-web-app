const test = require('ava')
const { resolve } = require('../src/container')
const { TreeNodeTypes } = require('../src/models/treeNode')

test.before(async t => {
  t.context = {
    mongoDb: await resolve('MongoService').start(),
    accountService: resolve('AccountService'),
    treeService: resolve('TreeService'),
    alice: await resolve('AccountService').create('Alice'),
    bob: await resolve('AccountService').create('Bob'),
    carol: await resolve('AccountService').create('Carol')
  }
})

test('Creating a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const treeNode = await treeService.create('TreeNode 1', 'A lone treeNode', TreeNodeTypes.standard, alice)
  const treeNodeObject = treeNode.toObject()

  t.is(treeNodeObject.name, 'TreeNode 1')
  t.is(treeNodeObject.description, 'A lone treeNode')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Getting a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const treeNode = await treeService.create('TreeNode 2', 'Another lone treeNode', TreeNodeTypes.standard, alice)

  const fetchedTreeNode = await treeService.get(treeNode._id)

  const treeNodeObject = fetchedTreeNode.toObject()

  t.is(treeNodeObject.name, 'TreeNode 2')
  t.is(treeNodeObject.description, 'Another lone treeNode')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Listing Active TreeNodes', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  await treeService.create('TreeNode 3', 'More lone treeNodes', TreeNodeTypes.standard, alice)
  const treeNodes = await treeService.listActive({
    name: 'TreeNode 3'
  })
  const treeNodeObject = treeNodes[0].toObject()

  t.is(treeNodeObject.name, 'TreeNode 3')
  t.is(treeNodeObject.description, 'More lone treeNodes')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Updating a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const treeNode = await treeService.create('TreeNode 4', 'A lot of lone treeNodes', TreeNodeTypes.standard, alice)
  await treeService.update(treeNode._id, {
    description: 'Wow I updated a treeNode'
  })

  const fetchedTreeNode = await treeService.get(treeNode._id)

  const treeNodeObject = fetchedTreeNode.toObject()

  t.is(treeNodeObject.name, 'TreeNode 4')
  t.is(treeNodeObject.description, 'Wow I updated a treeNode')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Deleting a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const treeNode = await treeService.create('TreeNode 5', 'A lot of lone treeNodes', TreeNodeTypes.standard, alice)
  await treeService.delete(treeNode._id, alice)

  const fetchedTreeNode = await treeService.get(treeNode._id)

  const treeNodeObject = fetchedTreeNode.toObject()

  t.is(treeNodeObject.name, 'TreeNode 5')
  t.is(treeNodeObject.description, 'A lot of lone treeNodes')
  t.is(treeNodeObject.deletedAt instanceof Date, true)
  t.is(treeNodeObject.children.length, 0)
  t.is(treeNodeObject.deletedByAccount._id.toString(), alice._id.toString())
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())

  const fetchedListTreeNode = await treeService.list({
    _id: treeNode._id
  })

  const listNodeObject = fetchedListTreeNode[0].toObject()

  t.is(listNodeObject.name, 'TreeNode 5')
  t.is(listNodeObject.description, 'A lot of lone treeNodes')
  t.is(listNodeObject.deletedAt instanceof Date, true)
  t.is(listNodeObject.children.length, 0)
  t.is(listNodeObject.deletedByAccount._id.toString(), alice._id.toString())
  t.is(listNodeObject.type, TreeNodeTypes.standard)
  t.is(listNodeObject.createdByAccount._id.toString(), alice._id.toString())

  t.is(await treeService.getActive(treeNode._id), null)
  t.deepEqual(await treeService.listActive({
    _id: treeNode._id
  }), [])
})
