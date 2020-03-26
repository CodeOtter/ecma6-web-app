import { Client } from '@sendgrid/client'

/**
 * [EmailProvider description]
 * @param {[type]} options.SendgridApiKey [description]
 */
function EmailProvider ({ SendgridApiKey }) {
  return new Client()
}

export default EmailProvider
