export default class SmsService {
  constructor ({ SmsProvider, LogService }) {
    this.log = LogService
    this.instance = SmsProvider
    this.log.debug('SmsService constructed')
  }
}
