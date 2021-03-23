const { getCurrentPrices, getPredictionsFromAPI } = require('./stock')
const { getPredictionFromCache } = require('./cache')

const updateWatchlistDetails = async (user) => {
    const stocksNeededFromAPI = []
    const watchlistSymbolList = []
    for (const stock of user.watchlist) {
        watchlistSymbolList.push(stock.symbol)
        const prediction = await getPredictionFromCache(stock.symbol)
        prediction
            ? (stock.prediction = prediction)
            : stocksNeededFromAPI.push(stock.symbol)
    }
    const currentPrices = await getCurrentPrices(watchlistSymbolList)
    let predictions
    if (stocksNeededFromAPI.length > 0) {
        predictions = await getPredictionsFromAPI(stocksNeededFromAPI)
    }
    for (const stock of user.watchlist) {
        if (currentPrices && currentPrices.price) {
            stock.currentPrice = currentPrices.price
        } else {
            stock.currentPrice = currentPrices[`${stock.symbol}`].price
        }
        if (predictions && predictions[`${stock.symbol}`]) {
            stock.prediction = predictions[`${stock.symbol}`]
        }
    }
    await user.save()
    return user
}

module.exports = {
    updateWatchlistDetails
}
