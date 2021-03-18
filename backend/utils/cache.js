const redis = require('redis')

const client = redis.createClient({
    host: 'cache',
})

const getCompanyNameFromCache = (symbol) => {
    client.get(symbol, (err, companyName) => {
        if (err) throw err
        if (companyName === null) return null
        console.log('\nUsing Cache\n')
        return companyName
    })
}

module.exports = {
    client,
    getCompanyNameFromCache,
}
