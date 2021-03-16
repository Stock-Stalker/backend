const { getCompanyName, getHistoricalData } = require('../utils/stock')
const { getCompanyNameFromCache } = require('../utils/cache')

exports.getStockData = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase()
  try {
    const companyName = await getCompanyNameFromCache(symbol) || await getCompanyName(symbol) // will be changed to get from mongo
    const historicalData = await getHistoricalData(symbol)
    const stockData = {
      symbol,
      companyName,
      historicalData,
      'currentPrice': historicalData[0].close
    }
    res.send({ stockData })
  } catch (err) {
    res.status(404).send({ message: err.message })
  }
}
