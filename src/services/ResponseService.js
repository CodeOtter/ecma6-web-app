import { HttpHostUrl } from '../config'

export default class ResponseService {
  constructor ({ LogService }) {
    this.log = LogService
    this.log.debug('ResponseService constructed')
  }

  getTransformers (endpoint, getData) {
    return {
      single: (instance) => {
        const result = {
          links: {
            self: `${HttpHostUrl}/${endpoint}/${instance._id}`
          },
          data: [getData(instance)]
        }
        return result
      },
      many: (instances, page, lastPage) => {
        const links = {
          self: `${HttpHostUrl}/${endpoint}`,
          first: `${HttpHostUrl}/${endpoint}?page=0`,
          last: `${HttpHostUrl}/${endpoint}?page=${lastPage}`
        }

        if (page === 0) {
          links.prev = `${HttpHostUrl}/${endpoint}?page=${(page - 1)}`
        }

        if (page === lastPage) {
          links.next = `${HttpHostUrl}/${endpoint}?page=${(page + 1)}`
        }

        const result = {
          links,
          data: instances.map(getData)
        }
        return result
      }
    }
  }
}
