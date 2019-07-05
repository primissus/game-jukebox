const passport = require('passport')
const auth = require('../auth')
const { User } = require('../../models')

function beforeInit (router) {
  // POST / register user
  router.post('/', register)

  // POST /login login
  router.post('/login', login)

  // GET current user
  router.get('/current', auth.required, getCurrent)

  function register (req, res, next) {
    const user = req.body

    const finalUser = new User({ email: user.email, password: user.password })

    let errors = finalUser.validateSync()

    if (errors) {
      return res.status(422).json(errors)
    }

    finalUser.setPassword(user.password)

    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }))
  }

  function login (req, res, next) {
    const { body: { user } } = req

    let validationErrors = isValidUser(user)
    if (validationErrors) {
      return res.status(422).json(validationErrors)
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) {
        return next(err)
      }

      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()

        return res.json({ user: user.toAuthJSON() })
      }

      return res.status(400).json(info)
    })(req, res, next)
  }

  function getCurrent (req, res, next) {
    console.log(req.payload)
    const { payload: { id } } = req

    return User.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400)
        }

        return res.json({ user: user.toAuthJSON() })
      })
  }

  function isValidUser (user) {
    user = user || {}

    if (!user.email) {
      return ({ errors: { email: 'is required' } })
    }

    if (!user.password) {
      return ({ errors: { password: 'is required' } })
    }
  }
}

module.exports = {
  Model: User,
  beforeInit,
  exclude: [
    {
      method: 'post',
      path: '/'
    }
  ]
}
