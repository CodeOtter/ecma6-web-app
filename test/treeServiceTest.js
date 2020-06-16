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
  t.is(treeNodeObject.ancestors.length, 0)
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
  t.is(treeNodeObject.ancestors.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Searching Active TreeNodes', async t => {
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
  t.is(treeNodeObject.ancestors.length, 0)
  t.is(treeNodeObject.deletedByAccount, null)
  t.is(treeNodeObject.type, TreeNodeTypes.standard)
  t.is(treeNodeObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Listing Active TreeNodes', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const createdTreeNode = await treeService.create('TreeNode 3.1', 'More lone treeNodes', TreeNodeTypes.standard, alice)
  const createdTreeNodeId = createdTreeNode._id.toString()

  const treeNode = await treeService.create('TreeNode 3.2', 'Another lone treeNodes', TreeNodeTypes.standard, alice)
  const deletedTreeNodeId = treeNode._id.toString()
  await treeService.delete(deletedTreeNodeId, alice)

  const treeNodes = await treeService.listActive()
  const index = treeNodes.findIndex(node => node._id.toString() === createdTreeNodeId)
  const treeNodeObject = treeNodes[index].toObject()
  
  t.is(treeNodes.findIndex(node => node._id.toString() === deletedTreeNodeId) > -1, false)
  t.is(treeNodeObject.name, 'TreeNode 3.1')
  t.is(treeNodeObject.description, 'More lone treeNodes')
  t.is(treeNodeObject.deletedAt, null)
  t.is(treeNodeObject.ancestors.length, 0)
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
  t.is(treeNodeObject.ancestors.length, 0)
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
  t.is(treeNodeObject.ancestors.length, 0)
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
  t.is(listNodeObject.ancestors.length, 0)
  t.is(listNodeObject.deletedByAccount._id.toString(), alice._id.toString())
  t.is(listNodeObject.type, TreeNodeTypes.standard)
  t.is(listNodeObject.createdByAccount._id.toString(), alice._id.toString())

  t.is(await treeService.getActive(treeNode._id), null)
  t.deepEqual(await treeService.listActive({
    _id: treeNode._id
  }), [])
})

test('Attaching a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 1', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child = await treeService.create('TreeNode Child 1', 'A sad treeNode', TreeNodeTypes.standard, alice)

  await treeService.attach(parent, child)
  const fetchedParent = await treeService.get(parent._id)
  const parentObject = fetchedParent.toObject()
  const fetchedChild = await treeService.get(child._id)
  const childObject = fetchedChild.toObject()
  
  t.is(parentObject.name, 'TreeNode Parent 1')
  t.is(parentObject.description, 'A lonely treeNode')
  t.is(parentObject.deletedAt, null)
  t.is(parentObject.ancestors.length, 0)
  t.is(parentObject.deletedByAccount, null)
  t.is(parentObject.type, TreeNodeTypes.standard)
  t.is(parentObject.createdByAccount._id.toString(), alice._id.toString())

  t.is(childObject.ancestors.length, 1)
  t.is(childObject.ancestors[0].name, 'TreeNode Parent 1')
  t.is(childObject.ancestors[0].description, 'A lonely treeNode')
  t.is(childObject.ancestors[0].deletedAt, null)
  t.is(childObject.ancestors[0].ancestors.length, 0)
  t.is(childObject.ancestors[0].deletedByAccount, null)
  t.is(childObject.ancestors[0].type, TreeNodeTypes.standard)
  t.is(childObject.ancestors[0].createdByAccount._id.toString(), alice._id.toString())
})

test('Detaching a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 2', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child = await treeService.create('TreeNode Child 2', 'A sad treeNode', TreeNodeTypes.standard, alice)

  await treeService.attach(parent, child)
  await treeService.detach(parent, child)

  const fetchedParent = await treeService.get(parent._id)
  const parentObject = fetchedParent.toObject()

  t.is(parentObject.name, 'TreeNode Parent 2')
  t.is(parentObject.description, 'A lonely treeNode')
  t.is(parentObject.deletedAt, null)
  t.is(parentObject.ancestors.length, 0)
  t.is(parentObject.deletedByAccount, null)
  t.is(parentObject.type, TreeNodeTypes.standard)
  t.is(parentObject.createdByAccount._id.toString(), alice._id.toString())

  const fetchedChild = await treeService.get(child._id)
  const childObject = fetchedChild.toObject()

  t.is(childObject.name, 'TreeNode Child 2')
  t.is(childObject.description, 'A sad treeNode')
  t.is(childObject.deletedAt, null)
  t.is(childObject.ancestors.length, 0)
  t.is(childObject.deletedByAccount, null)
  t.is(childObject.type, TreeNodeTypes.standard)
  t.is(childObject.createdByAccount._id.toString(), alice._id.toString())
})

test('Siblingify a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 3', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child = await treeService.create('TreeNode Child 3', 'A sad treeNode', TreeNodeTypes.standard, alice)
  
  const parent2 = await treeService.create('TreeNode Parent 4', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child2 = await treeService.create('TreeNode Child 4', 'A sad treeNode', TreeNodeTypes.standard, alice)

  await treeService.attach(parent, child)
  await treeService.attach(parent2, child2)
  await treeService.siblingify(child, child2)

  const fetchedChild1 = await treeService.get(child._id)
  const child1Object = fetchedChild1.toObject()

  t.is(child1Object.name, 'TreeNode Child 3')
  t.is(child1Object.description, 'A sad treeNode')
  t.is(child1Object.deletedAt, null)
  t.is(child1Object.ancestors.length, 1)
  t.deepEqual(child1Object.ancestors[0]._id, parent2._id)
  t.is(child1Object.deletedByAccount, null)
  t.is(child1Object.type, TreeNodeTypes.standard)
  t.is(child1Object.createdByAccount._id.toString(), alice._id.toString())

  const fetchedChild2 = await treeService.get(child2._id)
  const child2Object = fetchedChild2.toObject()

  t.is(child2Object.name, 'TreeNode Child 4')
  t.is(child2Object.description, 'A sad treeNode')
  t.is(child2Object.deletedAt, null)
  t.is(child2Object.ancestors.length, 1)
  t.deepEqual(child2Object.ancestors[0]._id, parent2._id)
  t.is(child2Object.deletedByAccount, null)
  t.is(child2Object.type, TreeNodeTypes.standard)
  t.is(child2Object.createdByAccount._id.toString(), alice._id.toString())
})

test('Move a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 5', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child = await treeService.create('TreeNode Child 5', 'A sad treeNode', TreeNodeTypes.standard, alice)
  
  const parent2 = await treeService.create('TreeNode Parent 6', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child2 = await treeService.create('TreeNode Child 6', 'A sad treeNode', TreeNodeTypes.standard, alice)

  await treeService.attach(parent, child)
  await treeService.attach(parent2, child2)
  await treeService.move(child, parent2)

  const fetchedChild1 = await treeService.get(child._id)
  const child1Object = fetchedChild1.toObject()

  t.is(child1Object.name, 'TreeNode Child 5')
  t.is(child1Object.description, 'A sad treeNode')
  t.is(child1Object.deletedAt, null)
  t.is(child1Object.ancestors.length, 1)
  t.deepEqual(child1Object.ancestors[0]._id, parent2._id)
  t.is(child1Object.deletedByAccount, null)
  t.is(child1Object.type, TreeNodeTypes.standard)
  t.is(child1Object.createdByAccount._id.toString(), alice._id.toString())

  const fetchedChild2 = await treeService.get(child2._id)
  const child2Object = fetchedChild2.toObject()

  t.is(child2Object.name, 'TreeNode Child 6')
  t.is(child2Object.description, 'A sad treeNode')
  t.is(child2Object.deletedAt, null)
  t.is(child2Object.ancestors.length, 1)
  t.deepEqual(child2Object.ancestors[0]._id, parent2._id)
  t.is(child2Object.deletedByAccount, null)
  t.is(child2Object.type, TreeNodeTypes.standard)
  t.is(child2Object.createdByAccount._id.toString(), alice._id.toString())
})

test('Copy a TreeNode', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 7', 'A lonely treeNode', TreeNodeTypes.standard, alice)
  const child = await treeService.create('TreeNode Child 7', 'A sad treeNode', TreeNodeTypes.standard, alice)

  await treeService.attach(parent, child)
  
  const copiedChild = await treeService.copy(child, 'Copied Child', alice)

  const fetchedCopy = await treeService.get(copiedChild._id)
  const copyObject = fetchedCopy.toObject()

  t.is(copyObject.name, 'Copied Child')
  t.is(copyObject.description, 'A sad treeNode')
  t.is(copyObject.deletedAt, null)
  t.deepEqual(copyObject.ancestors[0]._id.toString(), child.ancestors[0]._id.toString())
  t.is(copyObject.deletedByAccount, null)
  t.is(copyObject.type, TreeNodeTypes.standard)
  t.is(copyObject.createdByAccount._id.toString(), alice._id.toString())
})

test('inheriting TreeNode Meta', async t => {
  const treeService = t.context.treeService
  const alice = t.context.alice

  const parent = await treeService.create('TreeNode Parent 8', 'A lonely treeNode', TreeNodeTypes.standard, alice, undefined, {
    canWrite: [1],
    canRead: [0],
    canDelete: [1],
    typeAccess: [1, 1, 0, 5]
  })
  const child = await treeService.create('TreeNode Child 8', 'A sad treeNode', TreeNodeTypes.standard, alice, undefined, {
    canRead: [1],
    typeAccess: [0, 2, 1, 0, 0, 6]
  })
  const nextChild = await treeService.create('TreeNode Next  8', 'A distant treeNode', TreeNodeTypes.standard, alice, undefined, {
    canWrite: [0]
  })

  await treeService.attach(parent, child)
  await treeService.attach(child, nextChild)

  const meta = await treeService.inheritMeta(nextChild)

  t.is(meta.get('canWrite')[0], 1)
  t.is(meta.get('canRead')[0], 1)
  t.is(meta.get('canDelete')[0], 1)
  t.is(meta.get('typeAccess')[0], 1)
  t.is(meta.get('typeAccess')[1], 2)
  t.is(meta.get('typeAccess')[2], 1)
  t.is(meta.get('typeAccess')[3], 5)
  t.is(meta.get('typeAccess')[4], 0)
  t.is(meta.get('typeAccess')[5], 6)

  t.is(await treeService.hasMeta(nextChild, 'typeAccess', 5, 6), true)
})