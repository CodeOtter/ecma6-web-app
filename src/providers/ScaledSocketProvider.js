import PubNub from 'pubnub'

/**
 * [ScaledSocketProvider description]
 * @param {[type]} options.PubnubPublishKey   [description]
 * @param {[type]} options.PubnubSubscribeKey [description]
 * @param {[type]} options.PubnubUuid         [description]
 */
function ScaledSocketProvider ({ PubnubPublishKey, PubnubSubscribeKey, PubnubUuid }) {
  return new PubNub({
    publishKey: PubnubPublishKey,
    subscribeKey: PubnubSubscribeKey,
    uuid: PubnubUuid
  })
}

export default ScaledSocketProvider
