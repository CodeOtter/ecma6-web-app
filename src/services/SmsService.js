import Twilio from 'twilio'

export default class SmsService {
  constructor ({ TwilioAccountSid, TwilioAuthToken, LogService }) {
    this.log = LogService
    this.instance = new Twilio(TwilioAccountSid, TwilioAuthToken)
    this.log.debug('SmsService constructed')
  }
}
