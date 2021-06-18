const {
    getCompanyName,
    getHistoricalData,
    getAllCompanyNames,
    getPredictionFromAPI,
    getPredictionsFromAPI,
    getCurrentPrice
} = require('../utils/stock')
const { getPredictionFromCache } = require('../utils/cache')

exports.getAllStocks = async (req, res) => {
    try {
        const stockData = await getAllCompanyNames()
        return res.status(200).send(stockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.getOneStock = async (req, res) => {
    let symbol = req.params.symbol
    typeof symbol === 'string' ? (symbol = symbol.toUpperCase()) : (symbol = '')
    try {
        const companyName = await getCompanyName(symbol)
        const historicalData = await getHistoricalData(symbol, 'year')
        const currentPrice = await getCurrentPrice(symbol)
        const prediction =
            (await getPredictionFromCache(symbol)) ||
            (await getPredictionFromAPI(symbol))
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
    let symbol = req.params.symbol
    typeof symbol === 'string' ? (symbol = symbol.toUpperCase()) : (symbol = '')
    try {
        const prediction =
            (await getPredictionFromCache(symbol)) ||
            (await getPredictionFromAPI(symbol))
        return res.status(200).send({ prediction })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.getPopularStocks = async (req, res) => {
    const popularStockSymbols = ['AAPL', 'TSLA', 'NFLX', 'AMZN', 'FB']
    try {
        const currentPriceData = await getCurrentPrice(popularStockSymbols)
        const popularStockData = []
        const predictionsNeededFromAPI = []
        for (const stock in currentPriceData) {
            popularStockData.push({
                symbol: stock,
                currentPrice: currentPriceData[stock].price,
                prediction: 2
            })
            const prediction = await getPredictionFromCache(stock)
            prediction
                ? (stock.prediction = prediction)
                : predictionsNeededFromAPI.push(stock)
        }
        if (predictionsNeededFromAPI.length > 0) {
            const predictions = await getPredictionsFromAPI(
                predictionsNeededFromAPI
            )
            for (const stock of popularStockData) {
                if (
                    predictions &&
                    predictions[`${stock.symbol}`] !== undefined
                ) {
                    stock.prediction = predictions[`${stock.symbol}`]
                }
            }
        }
        return res.status(200).send(popularStockData)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
