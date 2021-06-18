const util = require('util')
const redis = require('redis')

const client = redis.createClient({
    host: 'cache'
})

client.get = util.promisify(client.get)

const getPredictionFromCache = async (symbol) => {
    const prediction = await client.get(`${symbol}_predict`)
    if (prediction === null) return null
    return prediction
}

module.exports = {
    client,
    getPredictionFromCache
}
