const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tokenSchema = new Schema({
    _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 60 * 60 * 24 } }
})

module.exports = mongoose.model('Tokens', tokenSchema)
