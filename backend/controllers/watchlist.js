const { getStock, getUser, AddSymbol } = require('../utils/watchlist')
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
        console.log(`symbolId: ${symbolID}`)
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { watchlist: { _id: symbolID.toString() } } },
            { new: true }
        ).populate('watchlist')
        return res.status(200).send(updatedUser.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
