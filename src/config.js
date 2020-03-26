import {
  asFunction,
  asClass,
  Lifetime,
  InjectionMode
} from 'awilix'
import { registerValue } from './container'
import dotenv from 'dotenv'

// @SETUP: Define dependency paths here
export const dependencyPaths = [
  [
    'src/providers/**/*.js', {
      lifetime: Lifetime.SINGLETON,
      register: asFunction
    }
  ],
  [
    'src/services/**/*.js', {
      injectionMode: InjectionMode.PROXY,
      lifetime: Lifetime.SINGLETON,
      register: asClass
    }
  ]
]

// @SETUP: Determine order of dependency injection here
export const serviceDependencyOrder = [
  // Services
  'MongoService',
  'HttpService',
  'SocketService',
  'SmsService',
  'EmailService'
]

dotenv.config()

// @SETUP: Define a .env file and defined the variables below there
export const MongoUrl = registerValue('MongoUrl', process.env.MONGO_URL)
export const HttpPort = registerValue('HttpPort', process.env.HTTP_PORT)
export const StaticFileDir = registerValue('StaticFileDir', process.env.STATIC_FILE_DIR)
export const TwilioAccountSid = registerValue('TwilioAccountSid', process.env.TWILIO_ACCOUNT_SID)
export const TwilioAuthToken = registerValue('TwilioAuthToken', process.env.TWILIO_AUTH_TOKEN)
export const SendgridApiKey = registerValue('SendgridApiKey', process.env.SENDGRID_API_KEY)
export const UsePubnub = registerValue('UsePubnub', parseInt(process.env.USE_PUBNUB))
export const PubnubPublishKey = registerValue('PubnubPublishKey', parseInt(process.env.PUBNUB_PUBLISH_KEY))
export const PubnubSubscribeKey = registerValue('PubnubSubscribeKey', parseInt(process.env.PUBNUB_SUBSCRIBE_KEY))
export const PubnubUuid = registerValue('PubnubUuid', parseInt(process.env.PUBNUB_UUID))
