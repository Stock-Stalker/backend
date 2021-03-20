const axios = require('axios')
const Symbols = require('../models/symbols')
const { client } = require('../utils/cache')

const getCurrentTime = () => {
    /*  return the current time in yyyy-mm-dd hh:mm:ss format */
    const dateOb = new Date()
    const date = ('0' + dateOb.getDate()).slice(-2) // adjust 0 before single digit date
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2)
    const year = dateOb.getFullYear()
    const hours = ('0' + dateOb.getHours()).slice(-2)
    const minutes = ('0' + dateOb.getMinutes()).slice(-2)
    const seconds = ('0' + dateOb.getSeconds()).slice(-2)

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

const getLastYearTime = () => {
    /*  return the last year time from current time in yyyy-mm-dd hh:mm:ss format */
    const dateOb = new Date()
    const date = ('0' + dateOb.getDate()).slice(-2)
    const month = ('0' + (dateOb.getMonth() + 1)).slice(-2)
    const year = dateOb.getFullYear() - 1
    const hours = ('0' + dateOb.getHours()).slice(-2)
    const minutes = ('0' + dateOb.getMinutes()).slice(-2)
    const seconds = ('0' + dateOb.getSeconds()).slice(-2)

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

const getHistoricalData = async (symbol) => {
    /* Returns the historical stock data
     Input: stock symbol
     Output: a list historical data
            {"datetime","open,"high","low","close","volume"} */
    try {
        const res = await axios.get(
            'https://api.twelvedata.com/time_series?' +
                `symbol=${symbol}&interval=1day&outputsize=365&format=JSON&` +
                `start_date=${getLastYearTime()}&` +
                `end_date=${getCurrentTime()}&` +
                `apikey=${process.env.STOCK_DATA_API}`
        )
        const stockData = res.data.values
        return stockData
    } catch (err) {
        console.log(err)
        throw err
    }
}

const getCompanyName = async (symbol) => {
    /* check if the symbol or company input is valid
    Input: stock symbol or company, case insensitive
    Output: {symbol,companyName} */
    try {
        const company = await Symbols.findOne({
            $or: [
                {
                    symbol: {
                        $regex: new RegExp('^' + symbol.toUpperCase(), 'i')
                    }
                },
                {
                    companyName: {
                        $regex: new RegExp('^' + symbol.toLowerCase(), 'i')
                    }
                }
            ]
        })
        if (!company) {
            throw new Error(`Cannot find ${symbol}`)
        }
        const { companyName } = company
        client.setex(symbol, 3600, companyName)
        return companyName
    } catch (err) {
        console.log(err)
        throw err
    }
}

const getAllStockData = async () => {
    /* Returns all the stocks' symbol and company name
     Output: {symbol,companyName} */
    try {
        const companies = await Symbols.find({}, { _id: 0 })
        return companies
    } catch (err) {
        console.log(err)
        throw err
    }
}

const getStockPrediction = async (symbol) => {
    // Returns predictions from /predictor. Either list of predictions or int:2
    try {
        const p = await axios.get(`http://stockstalker.tk/predictor/${symbol}`)
        return p.data
    } catch (err) {
        return err.message
    }
}

const getStockCurrentPrice = async (symbol) => {
    try {
        const targetSymbol = symbol.toUpperCase()
        const res = await axios.get(
            'https://api.twelvedata.com/price?' +
                `symbol=${targetSymbol}&` +
                `apikey=${process.env.STOCK_DATA_API}`)
        return res.data.price
    } catch (err) {
        return err.message
    }
}

module.exports = {
    getCompanyName,
    getHistoricalData,
    getAllStockData,
    getStockPrediction,
    getStockCurrentPrice
}
