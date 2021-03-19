const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')

const should = chai.should()
const { expect } = chai

chai.use(chaiHttp)
const agent = chai.request.agent(app)

const User = require('../models/user')
const Symbols = require('../models/symbols')

let token

/**
 * root level hooks
 */
after(function (done) {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    mongoose.connection.close()
    done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
describe('Watchlist API endpoints', function () {
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
                        console.log(res.body)
                        done()
                    }).catch(function (err) {
                        console.log(err)
                        done()
                    })
            }).catch(function (err) {
                console.log(err)
                done()
            })
    })

    // Delete sample user.
    afterEach(function (done) {
        User.deleteMany({ username: 'myuser' }).then(function () {
            done()
        })
    })

    it('should add a stock into users watchlist', function (done) {
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
                                expect(res.body.length).to.be.equal(initialCount + 1)
                                done()
                            }).catch(function (err) {
                                console.log(err)
                                done()
                            })
                    }).catch(function (err) {
                        console.log(err)
                        done()
                    })
            }).catch(function (err) {
                console.log(err)
                done()
            })
    })
    it('should remove a stock from users watchlist', function (done) {
        let initialCount = 0
        chai.request(app)
            .get('/api/user/watchlist')
            .set('Authorization', `Bearer ${token}`)
            .then(function (res) {
                initialCount = res.body.length
                chai.request(app)
                    .patch('/api/user/watchlist/remove')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ symbol: 'GOOG' })
                    .then(function (res) {
                        chai.request(app)
                            .get('/api/user/watchlist')
                            .set('Authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res.body.length).to.be.equal(initialCount - 1)
                                done()
                            }).catch(function (err) {
                                console.log(err)
                                done()
                            })
                    }).catch(function (err) {
                        console.log(err)
                        done()
                    })
            }).catch(function (err) {
                console.log(err)
                done()
            })
    })
    it('should get all stock data in users watchlist', function (done) {
        chai.request(app)
            .get('/api/user/watchlist')
            .set('Authorization', `Bearer ${token}`)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.body).to.be.an('Array')
                done()
            })
    })
})
