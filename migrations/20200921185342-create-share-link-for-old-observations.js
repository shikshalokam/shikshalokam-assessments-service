module.exports = {
  async up(db) {
    var md5 = require('md5');

    global.migrationMsg = "Created Shared Link For Old Observations"
    
    let observationDocuments = await db.collection('solutions').find({ isReusable:false, type:"observation" }, { author: 1 }).toArray();
    if(observationDocuments.length> 0) {
      
      await Promise.all(observationDocuments.map(async observation => {
        let hashedLink = md5(observation._id+"###"+observation.author);
        if (hashedLink) {
          db.collection('solutions').updateOne({ _id: observation._id }, { $set: { link: hashedLink } });
          
        }
      }));
    }
 
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
