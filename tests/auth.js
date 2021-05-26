const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')

const { describe, it, beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)

const User = require('../models/user')

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string

const user1 = {}
user1.username = process.env.USER1_USERNAME || 'myuser'
user1.password = process.env.USER1_PASSWORD || 'mypassword'

const user2 = {}
user2.username = process.env.USER1_USERNAME || 'anotheruser'
user2.password = process.env.USER1_PASSWORD || 'anotherpassword'

describe('Authentication API endpoints', function () {
    // Create a sample user for use in tests.
    beforeEach(function (done) {
        const sampleUser = new User({
            username: user1.username,
            password: user1.password,
            _id: SAMPLE_OBJECT_ID,
        })
        chai.request(app)
            .post('/api/user/signup')
            .set('content-type', 'application/json')
            .send(sampleUser)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                sampleUser.save()
                done()
            })
    })

    // Delete sample user.
    afterEach(function (done) {
        User.deleteMany({
            username: [user1.username, user2.username],
        }).then(function () {
            done()
        })
    })

    it('should sign up a new user', function (done) {
        chai.request(app)
            .post('/api/user/signup')
            .send({ username: user2.username, password: user2.password })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                res.body.should.be.an('object')
                res.body.token.should.be.a('string')
                // check that user is actually inserted into database
                User.findOne({ username: user2.username }).then(function (
                    user
                ) {
                    user.should.be.an('object')
                    done()
                })
            })
    })

    it('should sign in a user', function (done) {
        chai.request(app)
            .post('/api/user/signin')
            .send({ username: user1.username, password: user1.password })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                res.should.have.status(200)
                res.body.token.should.be.a('string')
                done()
            })
    })
})
