const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    watchlist: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'Symbols' }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
