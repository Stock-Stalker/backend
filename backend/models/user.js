const { Schema, model } = require('mongoose')

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
        watchlist: [{ type: Schema.Types.ObjectId, ref: 'Symbol' }],
        token: { type: String }
    },
    { timestamps: true }
)

userSchema.pre('findOne', function (next) {
    this.populate('watchlist')
    next()
})

userSchema.pre('findOne', function (next) {
    this.populate('watchlist')
    next()
})

userSchema.pre('findByIdAndUpdate', function (next) {
    this.populate('watchlist')
    next()
})

module.exports = model('User', userSchema)
