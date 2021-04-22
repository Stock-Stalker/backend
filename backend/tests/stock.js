const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')

const { describe, it } = require('mocha')

chai.use(chaiHttp)

describe('Stocks endpoints', function () {
    it('should get all the stock symbols and company names', (done) => {
        chai.request(app)
            .get('/api/stock').end((err, res) => {
                if (err) {
                    return done(err)
                }
                res.should.have.status(200)
                res.body.should.be.an('array')
                return done()
            })
    })

    it('should get the stock data', function (done) {
        this.timeout(12000)
        chai.request(app)
            .get('/api/stock/AAPL').end((err, res) => {
                if (err) {
                    return done(err)
                }
                res.should.have.status(200)
                res.body.should.be.an('Object')
                res.body.stockData.historicalData.should.be.an('array')
                // console.log(`res.body.stockData.symbol: ${res.body.stockData.symbol}`)
                res.body.stockData.symbol.should.equal('AAPL')
                res.body.stockData.companyName.should.equal('Apple')
                return done()
            })
    })

    it('should return status 404 when enter invalid symbol', function (done) {
        chai.request(app)
            .get('/api/stock/AAPLLL').end((err, res) => {
                if (err) {
                    return done(err)
                }
                res.should.have.status(404)
                return done()
            })
    })
    it('should return the prediction of a stock ', function (done) {
        this.timeout(10000)
        chai.request(app)
            .get('/api/stock/prediction/AAPL').end((err, res) => {
                if (err) {
                    return done(err)
                }
                res.should.have.status(200)
                parseFloat(res.body.prediction).should.be.a('Number')
                return done()
            })
    })
})
