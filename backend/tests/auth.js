const app = require('../app')
const chaiHttp = require('chai-http')
const chai = require('chai')
const mongoose = require('mongoose')

const should = chai.should()
const { expect } = chai

chai.use(chaiHttp)
const agent = chai.request.agent(app)

const User = require('../models/user')

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

describe('Authentication API endpoints', function () {
    // Create a sample user for use in tests.
    beforeEach(function (done) {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
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
                token = res.token
                sampleUser.save()
                done()
            })
    })

    // Delete sample user.
    afterEach(function (done) {
        User.deleteMany({
            username: ['myuser', 'anotheruser', 'mynewusername'],
        }).then(function () {
            done()
        })
    })

    it('should sign up a new user', function (done) {
        chai.request(app)
            .post('/api/user/signup')
            .send({ username: 'anotheruser', password: 'mypassword' })
            .end(function (err, res) {
                console.log(`@@@@@@ in signup test ${JSON.stringify(res)}`)
                console.log(`@@@@@@ in signup test ${JSON.stringify(res.body)}`)
                if (err) {
                    done(err)
                }
                expect(res.body).to.be.an('object')
                expect(res.body.token).to.be.a('string')
                // check that user is actually inserted into database
                User.findOne({ username: 'anotheruser' }).then(function (user) {
                    expect(user).to.be.an('object')
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
                expect(res).to.have.status(200)
                expect(res.body.token).to.be.a('string')
                done()
            })
    })
})
