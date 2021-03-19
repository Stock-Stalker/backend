const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')

const should = chai.should()
const { expect } = chai

chai.use(chaiHttp)
const agent = chai.request.agent(app)

describe('Stocks endpoints', function () {
    it('should get all the stock symbols and company names', (done) => {
        agent.get('/api/stocks').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.status.should.be.equal(200)
            expect(res.body).to.be.an('array')
            return done()
        })
    })

    it('should get the stock data', function (done) {
        agent.get('/api/stocks/AAPL').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.status.should.be.equal(200)
            expect(res.body).to.be.an('Object')
            expect(res.body.stockData.historicalData).to.be.an('array')
            expect(res.body.stockData.symbol).to.be.equal('AAPL')
            expect(res.body.stockData.companyName).to.be.equal('Apple')
            return done()
        })
    })

    it('should return status 404 when enter invalid symbol', function (done) {
        agent.get('/api/stocks/AAPLLL').end((err, res) => {
            if (err) {
                return done(err)
            }
            res.status.should.be.equal(404)
            return done()
        })
    })
})
