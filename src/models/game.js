const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const GameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  launchDate: { type: Date, required: true },
  cover: { type: String },
  company: { type: ObjectId, ref: 'Company' },
  consoles: [{ type: [ObjectId], ref: 'Console' }]
})

module.exports = mongoose.model('Games', GameSchema)
