const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')

const { describe, it, before, after, beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)

const User = require('../models/user')

let token

/**
 * root level hooks
 */
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
                    .then(function (res) {
                        done()
                    })
                    .catch(function (err) {
                        console.log(err)
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
                console.log(err)
                done()
            })
    })

    it('should add a stock if the it is not in the watchlist', function (done) {
        this.timeout(10000)
        let initialCount = 0
        chai.request(app)
            .get('/api/user/watchlist')
            .set('Authorization', `Bearer ${token}`)
            .then(function (res) {
                initialCount = res.body.length
                chai.request(app)
                    .patch('/api/user/watchlist')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ symbol: 'GOOG' })
                    .then(function (res) {
                        chai.request(app)
                            .get('/api/user/watchlist')
                            .set('Authorization', `Bearer ${token}`)
                            .then(function (res) {
                                res.should.have.status(200)
                                res.body.length.should.be(
                                    initialCount + 1
                                )
                                done()
                            })
                            .catch(function (err) {
                                console.log(err)
                                done()
                            })
                    })
                    .catch(function (err) {
                        console.log(err)
                        done()
                    })
            })
            .catch(function (err) {
                console.log(err)
                done()
            })
    })

    it('should remove a stock if it already exists in the watchlist', function (done) {
        this.timeout(5000)
        let initialCount = 0
        chai.request(app)
            .get('/api/user/watchlist')
            .set('Authorization', `Bearer ${token}`)
            .then(function (res) {
                initialCount = res.body.length
                chai.request(app)
                    .patch('/api/user/watchlist/')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ symbol: 'AAPL' })
                    .then(function (res) {
                        chai.request(app)
                            .get('/api/user/watchlist')
                            .set('Authorization', `Bearer ${token}`)
                            .then(function (res) {
                                res.should.have.status(200)
                                res.body.length.should.be(
                                    initialCount - 1
                                )
                                done()
                            })
                            .catch(function (err) {
                                console.log(err)
                                done()
                            })
                    })
                    .catch(function (err) {
                        console.log(err)
                        done()
                    })
            })
            .catch(function (err) {
                console.log(err)
                done()
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
})
