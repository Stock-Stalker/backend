const axios = require('axios')
const { robinhood, predictor } = require('../api')
const Symbol = require('../models/symbol')
const { client } = require('../utils/cache')

const getHistoricalData = async (symbol,span) => {
    // Returns the historical stock data
    // Input: stock symbol
    // Output: a list historical data
    //        {"datetime","open,"high","low","close","volume"}
    try {
        const res = await robinhood.get(`/${symbol}/historical/${span}`)
        if (!res.data.historical) {
            throw new Error(`Cannot get historical data for ${symbol}`)
        }
        return res.data.historical
    } catch (err) {
        console.log(err.message)
        throw err.message
    }
}

const getCompanyNameFromDB = async (symbol) => {
    /* check if the symbol
    Input: symbol
    Output: companyName */
    try {
        const company = await Symbol.findOne({ symbol: symbol })
        if (!company) {
            throw new Error(`Cannot find ${symbol}`)
        }
        const { companyName } = company
        client.setex(symbol, 3600, companyName)
        return companyName
    } catch (err) {
        throw err.message
    }
}

const getAllCompanyNames = async () => {
    /* Returns all the stocks' symbol and company name
     Output: {symbol,companyName} */
    try {
        const companies = await Symbol.find({}, { _id: 0 })
        return companies
    } catch (err) {
        throw err.message
    }
}

const getPredictionFromAPI = async (symbol) => {
    // Returns predictions from /predictor. Either list of predictions or int:2
    try {
        const res = await axios.get(
            `http://stockstalker.tk/predictor/${symbol}`
        )
        if (!res.data) {
            throw new Error(`Cannot get prediction for ${symbol}`)
        }
        client.setex(`${symbol}_predict`, 3600, res.data[`${symbol}`])
        return res.data[`${symbol}`]
    } catch (err) {
        throw err.message
    }
}

const getPredictionsFromAPI = async (symbols) => {
    try {
        const res = await axios.get(
            `http://stockstalker.tk/predictor/${symbols.join(',')}`
        )
        const predictions = res.data
        for (const symbol in predictions) {
            client.setex(`${symbol}_predict`, 3600, predictions[symbol])
        }
        return predictions
    } catch (err) {
        throw err.message
    }
}

const getCurrentPrice = async (symbol) => {
    // Returns an array of current prices
    // Input: symbol:string,array
    // Output: [price, ...]
    try {
        let res
        typeof symbol === 'string'
            ? (res = await robinhood.get(`/${symbol}/price`))
            : (res = await robinhood.get(`/${symbol.join(',')}/price`))
        if (!res.data.price) {
            throw new Error(`Cannot find current price for ${symbol}`)
        }
        return res.data.price
    } catch (err) {
        console.log(err.message)
        throw err.message
    }
}

const getCurrentPrices = async (symbols) => {
    try {
        const res = await axios.get(
            'https://api.twelvedata.com/price?' +
                `symbol=${symbols.join(',')}&` +
                `apikey=${process.env.STOCK_DATA_API}`
        )
        if (!res.data) {
            throw new Error(`Cannot find ${symbols.join(' ')}`)
        }
        return res.data
    } catch (err) {
        throw err.message
    }
}

module.exports = {
    getCompanyNameFromDB,
    getHistoricalData,
    getAllCompanyNames,
    getPredictionFromAPI,
    getPredictionsFromAPI,
    getCurrentPrice,
    getCurrentPrices
}
