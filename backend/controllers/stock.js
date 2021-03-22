const {
    getCompanyNameFromDB,
    getHistoricalData,
    getAllCompanyNames,
    getPredictionFromAPI,
    getCurrentPrice,
    getCurrentPrices
} = require('../utils/stock')
const {
    getCompanyNameFromCache,
    getPredictionFromCache
} = require('../utils/cache')

exports.getAllStocks = async (req, res) => {
    try {
        const stockData = await getAllCompanyNames()
        return res.status(200).send(stockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.getOneStock = async (req, res) => {
    const symbol = req.params.symbol.toUpperCase()
    try {
        const companyName =
            (await getCompanyNameFromCache(symbol)) ||
            (await getCompanyNameFromDB(symbol))
        const historicalData = await getHistoricalData(symbol)
        const currentPrice = await getCurrentPrice(symbol)
        let prediction =
            (await getPredictionFromCache(symbol)) ||
            (await getPredictionFromAPI(symbol))
        prediction = prediction.data
        const stockData = {
            symbol,
            companyName,
            currentPrice,
            prediction,
            historicalData
        }
        return res.status(200).send({ stockData })
    } catch (err) {
        return res.status(404).send({ message: err.message })
    }
}

exports.getPrediction = async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase()
        const prediction =
            (await getPredictionFromCache(symbol)) ||
            (await getPredictionFromAPI(symbol))
        return res.status(200).send({ prediction })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: err.message })
    }
}

exports.getPopularStocks = async (req, res) => {
    const popularStockSymbols = ['AAPL', 'TSLA', 'NFLX', 'AMZN', 'FB']
    try {
        const popularStockData = await getCurrentPrices(popularStockSymbols)
        return res.status(200).send(popularStockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
