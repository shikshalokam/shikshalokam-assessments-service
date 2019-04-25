const request = require('supertest');
const app = require("../app")

describe("School Leader registry",()=>{

  test('Schools Leader fetch api GET /', async (done) => {
    request(app)
      .get('/assessment/api/v1/schoolLeaderRegistry/form')
      .set('X-authenticated-user-token',process.env.TEST_TOKEN)
      .expect(200)
      .end((err) => {
        if (err) throw done(err);
        done();
      });
  });

  test('Schoos leaders list api GET',async (done)=>{
      request(app)
        .get('/assessment/api/v1/schoolLeaderRegistry/list/5bebcfcf92ec921dcf114827')
        .set('X-authenticated-user-token',process.env.TEST_TOKEN)
        .expect(200)
        .end((err) => {
          if (err) throw done(err);
          done();
        });
  })

  test('Schoos leaders list api GET',async (done)=>{
    request(app)
      .get('/assessment/api/v1/schoolLeaderRegistry/fetch/5c5acb9a52600a1ce8d25359')
      .set('X-authenticated-user-token',process.env.TEST_TOKEN)
      .expect(200)
      .end((err) => {
        if (err) throw done(err);
        done();
      });
  })

})

describe("School Leader registry",()=>{

  test('Schools Leader update api POST /', async (done) => {
    let bodyParams =  {
      "deleted" : false,
      "name" : "Katuri Venkateswar Rao",
      "age" : 54,
      "gender" : "Male",
      "bio" : "His relative used to work as teacher. While observing the relative, he realized that he liked that he liked to observe the children and spent time with them. He noticed that the children were facing problem with basic eng and math which he felt like he wanted to address. So during his degree he stated taking tuition for primary children. He took tuition for 3 years then he started the school in 1989since then he is running the school in rented buildings. He pays a lot of attention to spaces so made sure tha there will be enough space for children to play. He is a sports person himself and used to play kabbadi etc.",
      "experienceInEducationSector" : 30,
      "experienceInCurrentSchool" : 30,
      "experienceAsSchoolLeader" : 30,
      "dutiesOrResponsibility" : "Administrative and teaching. He teaches social and english to higher grades..",
      "timeOfAvailability" : "3.45",
      "nonTeachingHours" : 5,
      "bestPart" : "I like the administration duties. ",
      "challenges" : "To get best ranks for schools. ",
      "programId" : "5c56942d28466d82967b9479",
      "schoolId" : "5c5694be52600a1ce8d24dc3",
      "schoolName" : "Katuri Public School",
    }

     request(app)
      .post('/assessment/api/v1/schoolLeaderRegistry/update/5c529d6fdcfc8c2bc88e5a46')
      .send(bodyParams)
      .set('X-authenticated-user-token',process.env.TEST_TOKEN)
      .expect(200)
      .end((err) => {
        if (err) throw done(err);
        done();
      });
  });

})

   