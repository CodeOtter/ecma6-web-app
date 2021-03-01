import OpenTok from 'opentok'

/**
 * [SocketProvider description]
 */
function VideoStreamProvider ({ TokboxApiKey = '', TokboxApiSecret = ''}) {
  return new OpenTok(TokboxApiKey, TokboxApiSecret)
}

export default VideoStreamProvider
