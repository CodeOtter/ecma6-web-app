export class NotFound extends Error {
  constructor (message) {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}

export class BadInput extends Error {
  constructor (message) {
    super(message)
    this.name = 'BadInput'
    this.status = 400
  }
}
