import passport from 'passport'
import session from 'express-session'
import MongoStoreFactory from 'connect-mongo'
// https://github.com/jdesboeufs/connect-mongo

const MongoStore = new MongoStoreFactory(session)

export default class AuthenticationService {
  /**
   * Constructor
   * @param {*} param
   */
  constructor ({ AuthenticationProvider, HttpService, CookieSecret, MongoService }) {
    this.authenticators = AuthenticationProvider
    this.cookieSecret = CookieSecret
    this.mongoose = MongoService.mongoOrm
    this.http = HttpService
    this.instance = null
  }

  async start () {
    if (this.instance) {
      return this.instance
    }

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
    this.http.router.use(this.instance)
    this.http.router.use(passport.initialize())
    this.http.router.use(passport.session())
    return this.instance
  }

  stop () {}

  setSerialization (serializeUser, deserializeUser) {
    passport.serializeUser(async (user, done) => {
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
       return this.authenticators.local(getUserByUsername, validatePassword, isAuthorized)
  }
}
