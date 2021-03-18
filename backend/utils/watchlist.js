const User = require('../models/user')
const Symbols = require('../models/symbols')

const getStock = (symbol) =>
    new Promise((resolve, reject) => {
        Symbols.findOne({ symbol: symbol })
            .then((stock) => resolve(stock))
            .catch((error) => reject(error))
    })
const getUser = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId })
        return user
    } catch (err) {
        return err
    }
}

const checkDuplicate = (stockId, watchlist) => {
    for (let i = 0; i < watchlist.length; i++) {
        if (String(stockId) === String(watchlist[i]._id)) {
            return true
        }
    }
    return false
}

module.exports = {
    getStock,
    getUser,
    checkDuplicate
}
