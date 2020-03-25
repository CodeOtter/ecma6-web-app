import { Client } from '@sendgrid/client'

export default class EmailService {
  constructor ({ SendgridApiKey, LogService }) {
    this.log = LogService
    this.instance = new Client()
    this.instance.setApiKey(SendgridApiKey)
    this.log.debug('EmailService constructed')
  }
}
