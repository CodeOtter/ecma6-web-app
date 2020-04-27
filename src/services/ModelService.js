import { MongoFindCount } from '../config'

export default class TreeService {
  constructor (LogService, Model) {
    this.log = LogService
    this.model = Model
  }

  /**
   * Saves a Model
   * @param {Object} object
   */
  async save (object) {
    return object.save()
  }

  /**
   * Creates a Model
   * @param {String} name
   * @param {String} description
   * @param {String} type
   * @param {Account} createdByAccount
   * @param {Model[]} children
   */
  async create (criteria) {
    const result = await this.model.create(criteria)
    return result
  }

  /**
   * Updates a Model and returns it
   * @param {ObjectId} id
   * @param {Object} criteria
   */
  async update (id, criteria) {
    const result = await this.model.updateOne({
      _id: id
    }, criteria, {
      new: true,
      strict: false
    })

    return result
  }

  /**
   * Deletes a Model and returns it
   * @param {ObjectId} id
   * @param {Account} deletedByAccount
   */
  async delete (id, deletedByAccount) {
    const result = await this.model.findOneAndUpdate({
      _id: id
    }, {
      deletedAt: Date.now(),
      deletedByAccount
    }, {
      new: true,
      strict: false
    })

    return result
  }

  /**
   * Returns a Model by ID
   * @param {ObjectId} id
   * @param {Boolean} readOnly
   */
  async get (id, readOnly = false) {
    let accessor = this.model.findById(id)

    if (readOnly) {
      accessor = accessor.lean()
    }

    const result = await accessor()
    return result
  }

  /**
   * Returns a list of all matching Models
   * @param {Object} criteria
   * @param {Number} skip
   * @param {Number} limit
   * @param {Boolean} readOnly
   */
  async search (criteria = {}, skip = 0, limit = MongoFindCount, sort = {}, readOnly = false) {
    let accessor = this.model.find(criteria, null, {
      skip,
      limit
    }).sort(sort)

    if (readOnly) {
      accessor = accessor.lean()
    }

    const result = await accessor()
    return result
  }

  /**
   * Returns a list of matching non-deleted Models
   * @param {Object} criteria
   * @param {Number} skip
   * @param {Number} limit
   * @param {Boolean} readOnly
   */
  async list (criteria = {}, skip = 0, limit = MongoFindCount, sort = {}, readOnly = false) {
    let accessor = this.model.find({
      ...criteria,
      deletedAt: {
        $exists: false
      }
    }, null, {
      skip,
      limit
    }).sort(sort)

    if (readOnly) {
      accessor = accessor.lean()
    }

    const result = await accessor()
    return result
  }
}
