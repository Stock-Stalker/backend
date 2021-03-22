const { getPredictionsFromAPI } = require('../utils/stock')
const { getPredictionFromCache } = require('../utils/cache')
const User = require('../models/user')
const Symbol = require('../models/symbols')

exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        const watchlist = JSON.parse(JSON.stringify(user.watchlist))
        const stocksNeededFromAPI = []
        for (const stock of watchlist) {
            const prediction = await getPredictionFromCache(stock.symbol)
            console.log('FOR LOOP', prediction)
            prediction
                ? (stock.prediction = prediction.data)
                : stocksNeededFromAPI.push(stock.symbol)
        }
        if (stocksNeededFromAPI.length > 0) {
            const res = await getPredictionsFromAPI(stocksNeededFromAPI)
            console.log('PREDICTIONS', res)
            // prediction
            //     ? (stock.prediction = prediction.data)
            //     : stocksNeededFromAPI.push(stock.symbol)
        }
        console.log('WATCHLIST', watchlist)
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
