const { getStock, getUser } = require('../utils/watchlist')
const { getStockPrediction } = require('../utils/stock')
const User = require('../models/user')

exports.getWatchlist = async (req, res) => {
    try {
        const user = await getUser(req.userId)
        const watchlist = JSON.parse(JSON.stringify(user.watchlist))
        for (let i = 0; i < watchlist.length; i++) {
            const entry = watchlist[i]
            const prediction = await getStockPrediction(entry.symbol)
            entry.prediction = prediction.data
        }
        return res.status(200).send(watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}

exports.updateWatchlist = async (req, res) => {
    try {
        const targetSymbol = await getStock(req.body.symbol)
        const user = await getUser(req.userId)
        const isExist = await User.findOne({ _id: req.userId, watchlist: targetSymbol })
        if (isExist) {
            await user.watchlist.pull({ _id: targetSymbol._id })
        } else {
            await user.watchlist.addToSet(targetSymbol)
        }
        await user.save()
        return res.status(200).send(user.watchlist)
    } catch (err) {
        return res.status(403).send({ message: err.message })
    }
}
