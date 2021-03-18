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
                sampleUser.save()
                done()
            })
    })

    // Delete sample user.
    afterEach(function (done) {
        User.deleteMany({ username: 'myuser' }).then(function () {
            done()
        })
    })

    it('should get all stock data in users watchlist', function (done) {
        chai.request(app)
            .post('/api/user/watchlist')
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                console.log(`!!!!!! ${res.body}`)
                expect(res.body).to.be.an('Array')
                // expect(res.body.user).to.have.property('username', 'anotheruser');
            })
    })
})
