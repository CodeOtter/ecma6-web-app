import { Strategy } from 'passport-local'

const LocalStrategy = Strategy.LocalStrategy

/**
 * 
 */
function AuthenticationProvider () {
  return (getUserByUsername, validatePassword) => {
    return new LocalStrategy(
      async function(username, password, done) {
        const account = await getUserByUsername(username)

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
}

export default AuthenticationProvider
