const redis = require('redis')

const client = redis.createClient({
    host: 'cache'
})

const getCompanyNameFromCache = (symbol) => {
    client.get(symbol, (err, companyName) => {
        if (err) throw err
        if (companyName === null) return null
        console.log('\nUsing cache for company name\n')
        return companyName
    })
}

const getPredictionFromCache = (symbol) => {
    client.get(`${symbol}_predict`, (err, prediction) => {
        if (err) throw err
        if (prediction === null) return null
        console.log('\nUsing cache for prediction\n')
        return prediction
    })
}

module.exports = {
    client,
    getCompanyNameFromCache,
    getPredictionFromCache
}
