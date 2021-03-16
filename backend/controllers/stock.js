const { getCompanyName, getHistoricalData } = require('../utils/stock')
const { isCacheDataValid, getHistoricalDataFromCache } = require('../utils/cache')

exports.getStockData = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase()
  let stockData
  if (isCacheDataValid(symbol)) {
    stockData = getHistoricalDataFromCache(symbol)
  } else {
    const companyName = getCompanyName(symbol) // will be changed to get from mongo
    const historicalData = await getHistoricalData(symbol)
    stockData = {
      symbol,
      companyName,
      historicalData,
      'currentPrice': historicalData[0].close
    }
  }
  res.send({ stockData })
}
