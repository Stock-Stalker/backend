const { Schema, model } = require('mongoose')

const symbolSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    prediction: { type: Number, required: false },
    currentPrice: { type: String, required: false }
})

module.exports = model('Symbol', symbolSchema)
