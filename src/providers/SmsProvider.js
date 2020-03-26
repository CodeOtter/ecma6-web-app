import Twilio from 'twilio'

/**
 * [SmsProvider description]
 * @param {[type]} options.TwilioAccountSid [description]
 * @param {[type]} options.TwilioAuthToken  [description]
 */
function SmsProvider ({ TwilioAccountSid, TwilioAuthToken }) {
  return new Twilio(TwilioAccountSid, TwilioAuthToken)
}

export default SmsProvider
