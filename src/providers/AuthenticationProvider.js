import { Strategy } from 'passport-local'

const LocalStrategy = Strategy.LocalStrategy

const local = (getUserByUsername, validatePassword) => {
  return new LocalStrategy(
    async function (username, password, done) {
      let account

      try {
        account = await getUserByUsername(username)
      } catch (e) {
        return done(e)
      }

      if (!account) {
        return done(null, false, { message: 'Username not found' })
      }

      if (!validatePassword(account, password)) {
        return done(null, false, { message: 'Password is invalid' })
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
