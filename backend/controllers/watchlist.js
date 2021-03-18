const { getStock, getUser, checkDuplicate } = require('../utils/watchlist')
const User = require('../models/user')
const Symbols = require('../models/symbols')

exports.getwatchlist = async (req, res) => {
    try {
        const user = await getUser(req.userId)
        res.send(user.watchlist)
    } catch (err) {
        res.status(403).send({ message: err.message })
    }
}

exports.addToWatchlist = async (req, res) => {
    try {
        const user = await getUser(req.userId)
        const stock = await getStock(req.params.symbol)
        if (!checkDuplicate(stock._id, user.watchlist)) {
            user.watchlist.unshift(stock)
        }
        user.save()
        res.send(user.watchlist)
    } catch (err) {
        res.status(403).send({ message: err.message })
    }
}

exports.removeFromWatchlist = (req, res) => {
    Symbols.findOne({ symbol: req.params.symbol })
        .then((symbolToRemove) => {
            const symbolID = symbolToRemove._id
            return User.findByIdAndUpdate(
                req.userId,
                { $pull: { watchlist: symbolID } },
                { new: true }
            ).populate('watchlist')
        })
        .then((updatedUser) => {
            res.status(200).send(updatedUser.watchlist)
        })
        .catch((err) => {
            res.status(403).send({ message: err.message })
        })
}
