const mongoose = require('mongoose')
const passwordHandler = require('../lib/password-handler')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const addMinutes = require('date-fns/add_minutes')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, default: config.roles.client },
  games: [{ type: ObjectId, ref: 'Game' }]
})

UserSchema.methods.setPassword = function (password) {
  this.password = passwordHandler.cryptPassword(password)
}

UserSchema.methods.validatePassword = function (password) {
  return passwordHandler.comparePassword(password, this.password)
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = addMinutes(today, config.jwtExpirationMinutes)

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    config.jwtSecret
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

module.exports = mongoose.model('Users', UserSchema)
