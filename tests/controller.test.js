const request = require('supertest');
const app = require("../app")

describe("post api", () => {
    //life cycle hooks for unit testing
    // beforeAll(() => {
    //   mongoose.connect(
    //     "mongodb://localhost/sl-assessment",
    //     { useNewUrlParser: true }
    //   );
    // });
    //test the api functions
    test('Parent registry fetch api GET /', async () => {

      it(`Fetch all schools - /assessment/api/v1/schools/find`, (done) => {
        request(app)
            .get('/assessment/api/v1/schools/find')
            .end((err, res) => {
                res.body.should.have.status(200);
                done();
            });
      });

        // const response = await request("http://localhost:4201/assessment/api/v1/schoolLeaderRegistry/list").get('/list');
        // it('should be created', () => {
        //   expect(response.status).toEqual(200);
        // });
       
        // });
   
    // disconnecting the mongoose connections
    // afterAll(() => {
     
    //   mongoose.disconnect(done);
  });
  });

   