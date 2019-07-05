var bcrypt = require('bcrypt')

exports.cryptPassword = function (password) {
  let salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

exports.comparePassword = function (plainPass, hashword) {
  return bcrypt.compareSync(plainPass, hashword)
}
