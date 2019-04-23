const request = require('supertest');
let describe = require("jest")
// let SchoolLeaderRegistry = require("../controllers/v1/schoolLeaderRegistryController")

// beforeAll(async () => {
//     // do something before anything else runs
//     console.log('Jest starting!');
//    });

// afterAll(() => {
//     server.close();
//     console.log('server closed!');
// });
   
describe('basic route tests', () => {
    test('Parent registry fetch api GET /', async () => {
    const response = await request("http://localhost:4201/assessment/api/v1/schoolLeaderRegistry/list").get('/list');
    expect(response.status).toEqual(200);
    });
   });