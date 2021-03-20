const {
    getCompanyName,
    getHistoricalData,
    getAllStockData,
    getStockPrediction,
    getCurrentPrice
} = require('../utils/stock')
const { getCompanyNameFromCache } = require('../utils/cache')

exports.getAllStocks = async (req, res) => {
    try {
        const stockData = await getAllStockData()
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
            (await getCompanyName(symbol))
        const historicalData = await getHistoricalData(symbol)
        const currentPrice = await getCurrentPrice(symbol)
        let prediction = await getStockPrediction(symbol)
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

exports.getStockPrediction = async (req, res) => {
    try {
        const prediction = await getStockPrediction(req.params.symbol)
        return res.status(200).send(prediction)
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: err.message })
    }
}

exports.getPopularStocks = async (req, res) => {
    try {
        const popularStockData = []
        const popularStockSymbols = ['AAPL', 'TSLA', 'NFLX', 'AMZN', 'FB']
        for (const symbol of popularStockSymbols) {
            try {
                const currentPrice = await getCurrentPrice(symbol)
                popularStockData.push({
                    symbol: symbol,
                    currentPrice: currentPrice
                })
            } catch (err) {
                console.log(err)
            }
        }
        return res.status(200).send(popularStockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
