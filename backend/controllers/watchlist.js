const { getStockPrediction } = require('../utils/stock')
const User = require('../models/user')
const Symbols = require('../models/symbols')

exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        const watchlist = JSON.parse(JSON.stringify(user.watchlist))
        for (const stock of watchlist) {
            const prediction = await getStockPrediction(stock.symbol)
            stock.prediction = prediction.data
        }
        return res.status(200).send(watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}

exports.updateWatchlist = async (req, res) => {
    try {
        const symbol = req.body.symbol.toUpperCase()
        let user = await User.findOne({
            _id: req.userId,
            watchlist: { $elemMatch: { symbol: symbol } }
        })
        if (user) {
            await user.watchlist.pull({ symbol: symbol })
        } else {
            const stock = await Symbols.findOne({ symbol: symbol })
            user = await User.findOne({ _id: req.userId })
            await user.watchlist.addToSet(stock)
        }
        await user.save()
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
