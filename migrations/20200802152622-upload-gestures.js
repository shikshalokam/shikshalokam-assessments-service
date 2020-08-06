module.exports = {
  async up(db) {
    
    const kendraServiceHelper = require("../generics/services/kendra");

    global.migrationMsg = "Upload gestures";

    let gestures = [
      {
        name : "thumbsUp",
        path : "/static/mediaFiles/gesture/",
        type : gesture,
        code : Math.floor(100000 + Math.random() * 900000),
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      }
    ];

    for( let gesture = 0 ; gesture < gestures.length; gesture++ ) {

      await kendraServiceHelper.upload(
        `public/assets/mediaFiles/gesture/${gestures[gesture].icon}`,
        `static/mediaFiles/gesture/${gestures[gesture].icon}`
      );

      gestures[gesture].icon = "static/mediaFiles/gesture/" + gestures[gesture].icon; 
    }

    await db.collection('mediaFiles').insertMany(gestures);
    
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
