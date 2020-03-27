import Airtable from 'airtable'

/**
 * [AirtableProvider description]
 * @param {[type]} options.AirtableUrl    [description]
 * @param {[type]} options.AirtableKey    [description]
 * @param {[type]} options.AirtableBaseId [description]
 */
function AirtableProvider ({ AirtableUrl, AirtableKey, AirtableBaseId }) {
  Airtable.configure({
    AirtableUrl,
    AirtableKey
  })

  return Airtable.base(AirtableBaseId)
}

export default AirtableProvider
