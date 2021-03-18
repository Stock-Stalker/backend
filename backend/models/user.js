const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    watchlist: [ { type: Schema.Types.ObjectId, ref: 'Symbols', unique:true } ]
  },
  { timestamps: true }
)

userSchema.pre('findOne', function (next) {
  this.populate('watchlist');
  next();
});
userSchema.pre('findByIdAndUpdate', function (next) {
  this.populate('watchlist');
  next();
});

module.exports = mongoose.model('User', userSchema)
