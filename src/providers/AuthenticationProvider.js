import { Strategy } from 'passport-local'

const LocalStrategy = Strategy.LocalStrategy

const local = (getUserByUsername, validatePassword, isAuthorized, log) => {
  log('---> return local strategy')
  return new LocalStrategy(
    async function (username, password, done) {
      let account
      log('fuck is this')
      try {
        account = await getUserByUsername(username)
      } catch (e) {
        return done(e)
      }

      if (!account) {
        return done(null, false, { message: 'Username not found' })
      }

      if (!await validatePassword(account, password)) {
        return done(null, false, { message: 'Password is invalid' })
      }

      if (!await isAuthorized(account)) {
        return done(null, false, { message: 'This account is not authorized to login' })
      }

      return done(null, account)
    }
  )
}

/**
 * AuthenticationProvider
 */
function AuthenticationProvider () {
  return {
    local
  }
}

export default AuthenticationProvider
