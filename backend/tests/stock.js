const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')

const { describe, it, before, after } = require('mocha')

chai.use(chaiHttp)
const agent = chai.request.agent(app)

// before(function () {
//     return mongoose.connect(process.env.MONGODB_URI, {
//         useNewUrlParser: true,
//         useFindAndModify: false,
//         useCreateIndex: true
//     })
// })
//
// after(function (done) {
//     return mongoose.disconnect(done)
// })

describe('Stocks endpoints', function () {
    it('should get all the stock symbols and company names', (done) => {
        agent.get('/api/stock').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.should.have.status(200)
            res.body.should.be.an('array')
            return done()
        })
    })

    it('should get the stock data', function (done) {
        this.timeout(10000)
        agent.get('/api/stock/AAPL').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.stockData.historicalData.should.be.an('array')
            console.log(`res.body.stockData.symbol: ${res.body.stockData.symbol}`)
            res.body.stockData.symbol.should.equal('AAPL')
            res.body.stockData.companyName.should.equal('Apple')
            return done()
        })
    })

    it('should return status 404 when enter invalid symbol', function (done) {
        agent.get('/api/stock/AAPLLL').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.should.have.status(404)
            return done()
        })
    })
    it('should return the prediction of a stock ', function (done) {
        this.timeout(10000)
        agent.get('/api/stock/prediction/AAPL').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.should.have.status(200)
            parseFloat(res.body.prediction).should.be.a('Number')
            return done()
        })
    })
})
