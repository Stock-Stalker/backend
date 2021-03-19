const {
    getCompanyName,
    getHistoricalData,
    getAllStockData
} = require('../utils/stock')
const { getCompanyNameFromCache } = require('../utils/cache')
const axios = require('axios')
const { parse, stringify } = require('flatted')

exports.getAllStocks = async (req, res) => {
    try {
        const stockData = await getAllStockData()
        return res.status(200).send(stockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
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
        return res.status(200).send({ stockData })
    } catch (err) {
        return res.status(404).send({ message: err.message })
    }
}

exports.getStockPrediction = async (req, res) => {
    try {
        const symbol = req.params.symbol
        const p = await axios.get(`http://stockstalker.tk/predictor/${symbol}`)
        return res.status(200).send(p.data)
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: err.message })
    }
}
