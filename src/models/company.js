const mongoose = require('mongoose')
const { Schema } = mongoose

const CompanySchema = new Schema({
  name: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Companies', CompanySchema)
