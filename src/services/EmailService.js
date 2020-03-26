export default class EmailService {
  constructor ({ EmailProvider, LogService }) {
    this.log = LogService
    this.instance = EmailProvider
    this.log.debug('EmailService constructed')
  }
}
