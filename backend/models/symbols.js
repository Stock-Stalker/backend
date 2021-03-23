const mongoose = require('mongoose')

const Schema = mongoose.Schema

const symbolSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    prediction: { type: Number, required: false }
})

module.exports = mongoose.model('Symbols', symbolSchema)
