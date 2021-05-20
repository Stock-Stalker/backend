const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')

const should = chai.should()

const { describe, it, beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)

const User = require('../models/user')

let token

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
describe('Watchlist API endpoints', function () {
    this.timeout(3000)
    // Create a sample user for use in tests.
    beforeEach(function (done) {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            watchlist: [],
            _id: SAMPLE_OBJECT_ID
        })
        chai.request(app)
            .post('/api/user/signup')
            .set('content-type', 'application/json')
            .send(sampleUser)
            .then(function (res) {
                sampleUser.save()
                token = res.body.token
                chai.request(app)
                    .patch('/api/user/watchlist')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ symbol: 'AAPL' })
                    .end(function (err, res) {
                        if (err) { done(err) }
                        done()
                    })
            })
    })

    // Delete sample user.
    afterEach(function (done) {
        User
            .deleteMany({ username: 'myuser' })
            .then(function () {
                done()
            })
            .catch(function (err) {
                done(err)
            })
    })

    it('should add a stock if the it is not in the watchlist', function (done) {
        this.timeout(10000)
        const initialCount = 1
        chai.request(app)
            .patch('/api/user/watchlist')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'GOOG' })
            .end(function (err, res) {
                if (err) { done(err) }
                res.should.have.status(200)
                res.body.length.should.equal(
                    initialCount + 1
                )
                done()
            })
    })

    it('should remove a stock if it already exists in the watchlist', function (done) {
        this.timeout(5000)
        const initialCount = 1
        chai.request(app)
            .patch('/api/user/watchlist/')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'AAPL' })
            .end(function (err, res) {
                if (err) { done(err) }
                res.should.have.status(200)
                res.body.length.should.equal(
                    initialCount - 1
                )
                done()
            })
    })
})
// it('should get all stock data in users watchlist', function (done) {
//     chai.request(app)
//         .get('/api/user/watchlist')
//         .set('Authorization', `Bearer ${token}`)
//         .end(function (err, res) {
//             if (err) {
//                 done(err)
//             }
//             res.status.should.be.equal(200)
//             res.body.should.be.an('Array')
//             done()
//         })
// })
