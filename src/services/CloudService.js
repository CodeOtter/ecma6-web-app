export default class CloudService {
  constructor ({ CloudProvider, LogService }) {
    this.log = LogService
    this.instance = CloudProvider
    this.log.debug('CloudService constructed')
  }
}
