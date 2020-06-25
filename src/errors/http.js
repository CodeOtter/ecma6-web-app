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

export class ServerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ServerError'
    this.status = 500
  }
}

export class Conflict extends Error {
  constructor (message) {
    super(message)
    this.name = 'Conflict'
    this.status = 409
  }
}