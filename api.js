const axios = require('axios')

const robinhood = axios.create({
    baseURL: process.env.ROBINHOOD_API
})

const predictor = axios.create({
    baseURL: process.env.PREDICTOR_API
})

module.exports = { robinhood, predictor }
