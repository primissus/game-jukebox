const passport = require('passport')
const LocalStrategy = require('passport-local')

const { User } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if (user) {
        user.validatePassword(password).then(isPasswordValid => {
          if (isPasswordValid) {
            return done(null, user)
          } else {
            return done(null, false, { errors: { 'email or password': 'is invalid' } })
          }
        })
      } else {
        return done(null, false, { errors: { 'email or password': 'is invalid' } })
      }
    }).catch(done)
}))
