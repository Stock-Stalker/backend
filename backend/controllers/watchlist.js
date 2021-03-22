const { getPrediction } = require('../utils/stock')
const User = require('../models/user')
const Symbol = require('../models/symbols')

exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })
        const watchlist = JSON.parse(JSON.stringify(user.watchlist))
        for (const stock of watchlist) {
            const prediction = await getPrediction(stock.symbol)
            stock.prediction = prediction.data
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
