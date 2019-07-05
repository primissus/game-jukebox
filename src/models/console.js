const mongoose = require('mongoose')
const { Schema } = mongoose

const ConsoleSchema = new Schema({
  name: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Consoles', ConsoleSchema)
