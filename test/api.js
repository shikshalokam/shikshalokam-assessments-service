// make sure your process.env.NODE_ENV = 'testing' in .env file while you are runing testcases
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

const schoolId = '5bfe53ea1d0c350d61b78d2b';
const schoolExternalId = '1757256';
const submissionId = '5bf794f320695421eeaae2fe';
const programId = 'PROGID01'
const evidence_id = 'AC5'
const programName = 'DCPCR'
const parent_Id = '5bff7ab5697b004dcd880610'
chai.use(chaiHttp);

describe(`Schools`, () => {

    it(`Fetch all schools - /assessment/api/v1/schools/find`, (done) => {
        chai.request(app)
            .get('/assessment/api/v1/schools/find')
            .end((err, res) => {
                res.body.should.have.status(200);
                done();
            });
    });


    it(`Fetch parent interview response - /assessment/api/v1/submissions/getParentInterviewResponse/${submissionId}?parentId=${parent_Id}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/submissions/getParentInterviewResponse/${submissionId}?parentId=${parent_Id}`)
            .end((err, res) => {
                res.body.should.have.status(200);
                done()
            })
    })

    it(`Fetch submission status for school - /assessment/api/v1/submissions/status/${submissionId}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/submissions/status/${submissionId}`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })



});

describe(`Reports`, () => {

    it(`Fetch criterias based on school id - /assessment/api/v1/reports/generateCriteriasBySchoolId/${schoolExternalId}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/reports/generateCriteriasBySchoolId/${schoolExternalId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })



    it(`Generate submission reports by school id - /assessment/api/v1/reports/generateSubmissionReportsBySchoolId/${schoolExternalId}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/reports/generateSubmissionReportsBySchoolId/${schoolExternalId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done()
            })
    })



    it(`Generate school status based on program id - /assessment/api/v1/reports/programSchoolsStatus/${programId}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/reports/programSchoolsStatus/${programId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done()
            })
    })



    it(`Fetch program submission status - /assessment/api/v1/reports/programsSubmissionStatus/${programName}?evidenceId=${evidence_id}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/reports/programsSubmissionStatus/${programName}?evidenceId=${evidence_id}`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

});



describe(`Feedback`, () => {
    it(`Fetch school feedback form - /assessment/api/v1/feedback/form`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/feedback/form`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

});

describe(`Parent Registry`, () => {
    it(`Fetch parent info collection form for school - /assessment/api/v1/parentRegistry/form`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/parentRegistry/form`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it(`Fetch parent info list - assessment/api/v1/parentRegistry/list/${schoolId}`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/parentRegistry/list/${schoolId}`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

});

describe('Criteria Generation', () => {
    it(`Fetch Criteria, Parent and Instance Parent Questions - /assessment/api/v1/criterias/getCriteriasParentQuesAndInstParentQues`, (done) => {
        chai.request(app)
            .get(`/assessment/api/v1/criterias/getCriteriasParentQuesAndInstParentQues`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

})