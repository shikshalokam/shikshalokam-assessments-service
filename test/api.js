let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
chai.use(chaiHttp);

describe('Schools', () => {
    describe('/GET schools', () => {
        it('Fetch all schools', (done) => {
            chai.request(app)
                .get('/assessment/api/v1/schools/find')
                .end((err, res) => {
                    res.body.should.have.status(200);
                    done();
                });
        });
    });
    describe('/GET schools', () => {
        it('Fetch assessment for school', (done) => {
            chai.request(app)
                .get('/assessment/api/v1/schools/assessments/5bfe53ea1d0c350d61b78d2b')
                .end((err, res) => {
                    res.body.should.have.status(200);
                    done();
                });
        });
    });
});

describe('Reports', () => {
    
});

describe('Schools', () => {
    
});

describe('Feedback', () => {
    
});

describe('Parent Registry', () => {
    
});