module.exports = {
  async up(db) {
    var md5 = require('md5');

    global.migrationMsg = "Created Shared Link For Old Observations"
    
    let observationDocuments = await db.collection('observations').find({}).toArray();
    if(observationDocuments.length> 0) {
      
      await Promise.all(observationDocuments.map(async observation => {
        let hashedLink = md5(observation._id+"###"+observation.createdBy);
        if (hashedLink) {
          db.collection('observations').updateOne({ _id: observation._id }, { $set: { link: hashedLink } });
          
        }
      }));
    }
    console.log("Link Added")
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
