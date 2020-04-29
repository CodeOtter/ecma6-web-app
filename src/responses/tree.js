import ResponseService from '../service/ResponseService'

const TYPE = 'TreeNode'
const ENDPOINT = 'treeNodes'

const { single, many } = ResponseService.getTransformers(ENDPOINT, (instance) => {
  return {
    id: instance._id,
    type: TYPE,
    attributes: {
      name: instance.name,
      description: instance.description,
      type: instance.type
    },
    relationships: {
      children: instance.children.map(single)
    }
  }
})

export const asSingleTree = single
export const asManyTree = many
