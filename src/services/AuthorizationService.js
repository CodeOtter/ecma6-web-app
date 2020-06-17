export default class AuthorizationService {
  /**
   * Constructor
   * @param {*} param
   */
  constructor ({}) {
  }

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
}
