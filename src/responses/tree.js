import ResponseService from '../service/ResponseService'
import { endpoint } from '../routes/trees'
import { TreeNodeSchema } from '../models/treeNode'

const { single, many } = ResponseService.getTransformers(endpoint, (instance) => {
  return {
    id: instance._id,
    type: TreeNodeSchema.name,
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
