const app = require('../app');
const chaiHttp = require('chai-http');
const chai = require('chai');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe('Stocks endpoints', function () {
  it('should return all the stock symbols and company names', (done) => {
    agent
      .get('/api/stocks')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.status.should.be.equal(200);
        expect(res.body).to.be.an('array');
        return done();
      });
  });
});