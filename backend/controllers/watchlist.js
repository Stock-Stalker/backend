const { getPredictionsFromAPI } = require('../utils/stock')
const { getPredictionFromCache } = require('../utils/cache')
const User = require('../models/user')
const Symbol = require('../models/symbols')

exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        const { watchlist } = user
        const stocksNeededFromAPI = []
        for (const stock of watchlist) {
            const prediction = await getPredictionFromCache(stock.symbol)
            prediction
                ? (stock.prediction = prediction)
                : stocksNeededFromAPI.push(stock.symbol)
        }
        if (stocksNeededFromAPI.length > 0) {
            const predictions = await getPredictionsFromAPI(stocksNeededFromAPI)
            for (const stock of watchlist) {
                if (!stock.prediction) {
                    stock.prediction = predictions[stock.symbol]
                }
            }
        }
        return res.status(200).send(watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}

exports.updateWatchlist = async (req, res) => {
    try {
        const stock = await Symbol.findOne({
            symbol: req.body.symbol.toUpperCase()
        })
        let user = await User.findOne({ _id: req.userId, watchlist: stock })
        if (user) {
            await user.watchlist.pull({ _id: stock._id })
        } else {
            user = await User.findOne({ _id: req.userId })
            await user.watchlist.addToSet(stock)
        }
        await user.save()
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
