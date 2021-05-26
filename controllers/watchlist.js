const { updateWatchlistDetails } = require('../utils/watchlist')
const User = require('../models/user')
const Symbol = require('../models/symbol')

const { validationResult } = require('express-validator')

exports.getWatchlist = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.userId })
        user = await updateWatchlistDetails(user)
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}

exports.updateWatchlist = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { symbol } = req.body
    try {
        const stock = await Symbol.findOne({
            symbol: symbol.toUpperCase()
        })
        let user = await User.findOne({ _id: req.userId, watchlist: stock })
        if (user) {
            await user.watchlist.pull({ _id: stock._id })
        } else {
            user = await User.findOne({ _id: req.userId })
            await user.watchlist.addToSet(stock)
        }
        await user.save()
        user = await updateWatchlistDetails(user)
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
