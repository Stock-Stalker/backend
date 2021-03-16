const redis = require('redis')

const client = redis.createClient({
  host: 'cache'
})

const isCacheDataValid = symbol => {
  client.get(`${symbol}_EX`, (err, data) => {
    if (err) throw err
    if (data === null) return false
    return true
  })
}

const getHistoricalDataFromCache = symbol => {
  client.hget(symbol, (err, stockData) => {
    if (err) throw err
    if (stockData === null) return null
    return stockData
  })
}

module.exports = {
  client,
  isCacheDataValid,
  getHistoricalDataFromCache
}
