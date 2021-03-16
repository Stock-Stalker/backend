const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Symbols = new Schema({
  symbol: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Symbols', Symbols)
