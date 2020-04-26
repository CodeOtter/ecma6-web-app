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
  'LogService',
  'MongoService',
  'AuthenticationService',
  'SmsService',
  'EmailService',
  'CloudService',
  'VideoStreamService',
  'HttpService',
  'SocketService'
]

dotenv.config()

// @SETUP: Define a .env file and defined the variables below there
export const MongoUrl = registerValue('MongoUrl', process.env.MONGO_URL)
export const HttpPort = registerValue('HttpPort', process.env.HTTP_PORT)
export const StaticFileDir = registerValue('StaticFileDir', process.env.STATIC_FILE_DIR)
export const TwilioAccountSid = registerValue('TwilioAccountSid', process.env.TWILIO_ACCOUNT_SID)
export const TwilioAuthToken = registerValue('TwilioAuthToken', process.env.TWILIO_AUTH_TOKEN)
export const SendgridApiKey = registerValue('SendgridApiKey', process.env.SENDGRID_API_KEY)
export const UsePubnub = registerValue('UsePubnub', parseInt(process.env.USE_PUBNUB) || 0)
export const PubnubPublishKey = registerValue('PubnubPublishKey', process.env.PUBNUB_PUBLISH_KEY)
export const PubnubSubscribeKey = registerValue('PubnubSubscribeKey', process.env.PUBNUB_SUBSCRIBE_KEY)
export const PubnubUuid = registerValue('PubnubUuid', process.env.PUBNUB_UUID)
export const AirtableUrl = registerValue('AirtableUrl', process.env.AIRTABLE_URL || 'https://api.airtable.com')
export const AirtableKey = registerValue('AirtableKey', process.env.AIRTABLE_KEY)
export const AirtableBaseId = registerValue('AirtableBaseId', process.env.AIRTABLE_BASE_ID)
export const RollbarAccessToken = registerValue('RollbarAccessToken', process.env.ROLLBAR_ACCESS_TOKEN)
export const AwsAccessKeyId = registerValue('AwsAccessKeyId', process.env.AWS_ACCESS_KEY_ID)
export const AwsSecretAccessKey = registerValue('AwsSecretAccessKey', process.env.AWS_SECRET_ACCESS_KEY)
export const AwsSessionToken = registerValue('AwsSessionToken', process.env.AWS_SESSION_TOKEN)
export const TokboxApiKey = registerValue('TokboxApiKey', process.env.TOKBOX_API_KEY)
export const TokboxApiSecret = registerValue('TokboxApiSecret', process.env.TOKBOX_API_SECRET)
