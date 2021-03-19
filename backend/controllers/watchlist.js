const { getStock, getUser } = require('../utils/watchlist')
const User = require('../models/user')
const Symbols = require('../models/symbols')

exports.getWatchlist = async (req, res) => {
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
        const stock = await getStock(req.body.symbol)
        user.watchlist.addToSet(stock)
        await user.save()
        const updatedUser = await getUser(req.userId)
        res.send(updatedUser.watchlist)
    } catch (err) {
        res.status(403).send({ message: err.message })
    }
}

exports.removeFromWatchlist = async (req, res) => {
    try {
        const symbolToRemove = await Symbols.findOne({
            symbol: req.body.symbol
        })
        const symbolID = symbolToRemove._id
        const user = await User.findOne({ _id: req.userId })
        await user.watchlist.pull({ _id: symbolID })
        user.save()
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
