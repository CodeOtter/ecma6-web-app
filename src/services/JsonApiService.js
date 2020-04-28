class JsonApiDocument {
  constructor ({ data, links, included, errors, meta }) {
    if (links) {
      this.links = JsonApiLinks(links)
    }

    if (data instanceof Array) {
      this.data = []
      for (const dataItem of data) {
        this.data.push(new JsonApiResource(dataItem))
      }
    } else {
      this.data = [new JsonApiResource(data)]
    }

    if (errors) {
      for (var error of errors) {
        this.errors = new JsonApiError(error)
      }
    }

    if (included) {
      this.included = []

      if (included instanceof Array) {
        for (const includedItem of included) {
          this.included.push(new JsonApiResource(includedItem))
        }
      } else {
        this.included = [new JsonApiResource(included)]
      }
    }

    if (meta) {
      this.meta = meta
    }
  }
}

/*
"links": {
  "self": "http://example.com/posts"
}

"links": {
  "related": {
    "href": "http://example.com/articles/1/comments",
    "meta": {
      "count": 10
    }
  }
}
*/
function JsonApiLinks ({ self, related, first, last, prev, next, href, about }) {
  const links = {}

  if (self) {
    links.self = self
  }

  if (related) {
    links.related = related
  }

  if (first) {
    links.first = first
  }

  if (last) {
    links.last = last
  }

  if (next) {
    links.next = next
  }

  if (prev) {
    links.prev = prev
  }

  if (href) {
    links.href = href
  }

  if (about) {
    links.about = about
  }

  return links
}

/*
id: a unique identifier for this particular occurrence of the problem.
links: a links object containing the following members:
  about: a link that leads to further details about this particular occurrence of the problem.
status: the HTTP status code applicable to this problem, expressed as a string value.
code: an application-specific error code, expressed as a string value.
title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
source: an object containing references to the source of the error, optionally including any of the following members:
  pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
  parameter: a string indicating which URI query parameter caused the error.
meta: a meta object containing non-standard meta-information about the error.
*/
class JsonApiError {
  constructor (id, links, status, code, title, detail, source, meta) {
    this.id = id

    if (links) {
      this.links = JsonApiLinks(links)
    }

    this.status = status
    this.code = code
    this.title = title
    this.detail = detail
    this.source = source

    if (meta) {
      this.meta = meta
    }
  }
}

/*
id
type
Exception: The id member is not required when the resource object originates at the client and represents a new resource to be created on the server.

In addition, a resource object MAY contain any of these top-level members:

attributes: an attributes object representing some of the resource’s data.
relationships: a relationships object describing relationships between the resource and other JSON:API resources.
links: a links object containing links related to the resource.
meta: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
*/
class JsonApiResource {
  constructor ({ id, _id, type, relationships, links, meta, ...attributes }) {
    this.id = id || _id
    this.type = type || 'Unknown'
    this.attributes = attributes || {}

    if (relationships) {
      this.relationships = {}
      for (const relationship of relationships) {
        if (this.attributes[relationship]) {
          this.relationships[relationship] = new JsonApiResource(this.attributes[relationship])
          delete this.attributes[relationship]
        }
      }
    }

    if (links) {
      this.links = JsonApiLinks(links)
    }
  }
}

export default class JsonApiService {
  constructor ({ LogService }) {
    this.log = LogService
    this.models = new Map()
    this.log.debug('TreeService constructed')
  }

  /**
   * 
   * @param {*} model 
   * @param {*} configuration 
   */
  registerModel (model, configuration) {
    this.models.set(model.name || model, configuration)
  }

  /**
   * 
   * @param {*} modelInstance 
   */
  getDocument (modelInstance) {
    const configuration = this.models(modelInstance.name)

    if (!configuration) {
      throw new ReferenceError(`${modelInstance.name} has not been registered.`)
    }
  }
}
