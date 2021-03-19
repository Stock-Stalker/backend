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

exports.getStockPrediction = async (req, res) => {
    try {
        const symbol = req.params.symbol
        const p = await axios.get(`http://stockstalker.tk/predictor/${symbol}`)
        console.log(`prediction: ${p.data.toString()}`)
        return res.status(200).json({ prediction: p.data.predictions.toString() })
        // return res.status(200).send(p)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
