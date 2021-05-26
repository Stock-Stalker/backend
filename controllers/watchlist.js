const { updateWatchlistDetails } = require('../utils/watchlist')
const User = require('../models/user')
const Symbol = require('../models/symbol')

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
    let symbol = req.body.symbol
    typeof symbol === 'string' ? symbol.toUpperCase() : (symbol = '')
    try {
        const stock = await Symbol.findOne({
            symbol: symbol
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
