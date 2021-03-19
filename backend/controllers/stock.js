const fs = require('fs')
const {
    getCompanyName,
    getHistoricalData,
    getAllStockData
} = require('../utils/stock')
const { getCompanyNameFromCache } = require('../utils/cache')

exports.getAllStocks = async (req, res) => {
    try {
        const stockData = await getAllStockData()
        res.send(stockData)
    } catch (err) {
        res.send({ message: err.message })
    }
}

exports.getStockData = async (req, res) => {
    const symbol = req.params.symbol.toUpperCase()
    try {
        const companyName =
            (await getCompanyNameFromCache(symbol)) ||
            (await getCompanyName(symbol))
        const historicalData = await getHistoricalData(symbol)
        const stockData = {
            symbol,
            companyName,
            historicalData,
            currentPrice: historicalData[0].close
        }
        res.send({ stockData })
    } catch (err) {
        res.status(404).send({ message: err.message })
    }
}

exports.getPopularStock = (req, res) => {
    fs.readFile('data/popularStock.json', (err, data) => {
        if (err) throw err
        const popularStock = JSON.parse(data)
        return res.status(200).send(popularStock)
    })
}
