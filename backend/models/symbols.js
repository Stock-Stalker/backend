const mongoose = require('mongoose')

const Schema = mongoose.Schema

const symbolSchema = new Schema({
  symbol: { type: String, required: true },
  companyName: { type: String, required: true }
})

module.exports = mongoose.model('Symbols', symbolSchema)
