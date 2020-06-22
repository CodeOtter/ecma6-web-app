import passport from 'passport'
import session from 'express-session'
import MongoStoreFactory from 'connect-mongo'
// https://github.com/jdesboeufs/connect-mongo

export default class AuthenticationService {
  /**
   * Constructor
   * @param {*} param
   */
  constructor ({ AuthenticationProvider, HttpService, CookieSecret, MongoService, LogService }) {
    this.authenticators = AuthenticationProvider
    this.cookieSecret = CookieSecret
    this.mongoose = MongoService.mongoOrm
    this.http = HttpService
    this.log = LogService
    this.instance = null
  }

  async start () {
    if (this.instance) {
      this.log.debug('AuthenticationService already started')
      return this.instance
    }

    const MongoStore = new MongoStoreFactory(session)

    const store = new MongoStore({
      mongooseConnection: this.mongoose.connection
    })

    this.instance = session({
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null,
        sameSite: true
      },
      resave: true,
      saveUninitialized: true,
      secret: this.cookieSecret,
      store
    })

    this.log.silly('Injecting AuthenticationService into the HTTP Router middleware')
    this.http.router.use(this.instance)
    this.log.silly('Initializing PassPort for HTTP Router middleware')
    this.http.router.use(passport.initialize())
    this.log.silly('Initializing PassPort Session for HTTP Router middleware')
    this.http.router.use(passport.session())

    return this.instance
  }

  stop () {}

  setSerialization (serializeUser, deserializeUser) {
    passport.serializeUser(async (user, done) => {
      this.log.silly('Serializing Passport User')
      try {
        const id = await serializeUser(user)
        if (id) {
          return done(null, id)
        } else {
          return done(false)
        }
      } catch (e) {
        return done(e)
      }
    })
    passport.deserializeUser(async (id, done) => {
      this.log.silly('Deserializing Passport User')
      try {
        const user = await deserializeUser(id)
        if (user) {
          return done(null, user)
        } else {
          return done(false)
        }
      } catch (e) {
        return done(e)
      }
    })
  }

  /**
   * getStrategy
   * @param {*} getUserByUsername
   * @param {*} validatePassword
   * @param {*} isAuthorized
   */
  getLocal (getUserByUsername, validatePassword, isAuthorized) {
    this.log.silly('Getting Local Passport strategy')
    return this.authenticators.local(getUserByUsername, validatePassword, isAuthorized, this.log)
  }
}
