const User = require('../models/user')
const Symbols = require('../models/symbols')

const getStock = async (symbol) => {
    try {
        const stock = await Symbols.findOne({ symbol: symbol })
        return stock
    } catch (error) {
        return error.message
    }
}

const getUser = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId })
        return user
    } catch (err) {
        return err
    }
}

module.exports = {
    getStock,
    getUser
}
