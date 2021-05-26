const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')

const { describe, it, beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)

const User = require('../models/user')

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string

describe('Authentication API endpoints', function () {
    // Create a sample user for use in tests.
    beforeEach(function (done) {
        const sampleUser = new User({
            username: process.env.USER1_USERNAME,
            password: process.env.USER1_PASSWORD,
            _id: SAMPLE_OBJECT_ID
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
            username: [process.env.USER1_USERNAME, process.env.USER2_USERNAME]
        }).then(function () {
            done()
        })
    })

    it('should sign up a new user', function (done) {
        chai.request(app)
            .post('/api/user/signup')
            .send({ username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                res.body.should.be.an('object')
                res.body.token.should.be.a('string')
                // check that user is actually inserted into database
                User.findOne({ username: process.env.USER2_USERNAME }).then(function (
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
            .send({ username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD })
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
