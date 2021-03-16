
const { getHistoricalData,checkSymbol } = require('../utils/stock')

exports.getStock = (req, res) => {
  let stockData = {}
  checkSymbol(req.params.symbol)
  .then((stockInfo)=>{
    stockData = stockInfo
    return getHistoricalData(stockInfo.symbol)
  })
  .then((historicalData)=>{
    stockData.current_price = historicalData[0].close
    stockData.historicalData = historicalData
    res.send({stockData})
  })
  .catch((error)=>{
    console.log('!!!!!!!!!!!!')
    res.status(404).send({message:error.message})
  })
}
