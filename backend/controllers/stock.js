const { getCompanyName, getHistoricalData } = require('../utils/stock')

exports.getStock = (req, res) => {
  Promise.all([getCompanyName(req.params.symbol),
    getHistoricalData(req.params.symbol)]).then(([name, historicalData]) => {
      const stockData = { 'symbol': req.params.symbol,
        'name': name,
        'current_price': historicalData[0].close,
        'historical_data': historicalData}
      res.send({ stockData })
    })
  .catch((err) => {
    console.log(err)
  })
}
