export default class AuthorizationService {

  async start () {}

  async stop () {}

  /**
   * 
   * @param {*} permissions 
   */
  getPermissionsFromJson (permissions) {
    if (!(permissions instanceof Map)) {
      if (typeof permissions === 'object') {
        permissions = new Map(Object.entries(permissions))
      } else {
        permissions = new Map()
      }
    }

    permissions.forEach((value, key) => {
      if(value instanceof Array) {
        permissions.set(key, Buffer.from(value))
      }
    })

    return permissions
  }

  /**
   * 
   * @param {*} account 
   * @param {*} name 
   * @param {*} slotId 
   * @param {*} value 
   */
  async canPerform (account, name, slotId, value) {
    for (const role of account.roles) {
      if(await this.auth.hasMeta(role, name, slotId, value, account.permissions)) {
        return true
      }
    }
    return false
  }

  /**
   * 
   * @param {*} account 
   * @param {*} data 
   * @param {*} fields 
   */
  async filterFields (account, data, validationSchema) {
    const fields = Object.keys(validationSchema)
    const result = {}

    for (const field of fields) {
      const filters = validationSchema[field] instanceof Array
        ? validationSchema[field]
        : [validationSchema[field]]

      let isFieldValid = true

      for (const filter of filters) {
        if (!await filter(account, data, data[field], field)) {
          isFieldValid = false
          break
        }
      }

      if (isFieldValid) {
        result[field] = data[field]
      }
    }

    return result
  }
}
