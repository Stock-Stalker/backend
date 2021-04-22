const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')

const { describe, it, before, after, beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)

const User = require('../models/user')

/**
 * root level hooks
 */
before(function () {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})

after(function (done) {
    return mongoose.disconnect(done)
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string

describe('Authentication API endpoints', function () {
    // Create a sample user for use in tests.
    beforeEach(function (done) {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
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
            username: ['myuser', 'anotheruser', 'mynewusername']
        }).then(function () {
            done()
        })
    })

    it('should sign up a new user', function (done) {
        chai.request(app)
            .post('/api/user/signup')
            .send({ username: 'anotheruser', password: 'mypassword' })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                res.body.should.be.an('object')
                res.body.token.should.be.a('string')
                // check that user is actually inserted into database
                User.findOne({ username: 'anotheruser' }).then(function (user) {
                    user.should.be.an('object')
                    done()
                })
            })
    })

    it('should sign in a user', function (done) {
        chai.request(app)
            .post('/api/user/signin')
            .send({ username: 'myuser', password: 'mypassword' })
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
