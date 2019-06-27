module.exports = {
  async up(db) {
    global.migrationMsg = "Include collectionName and what does it update"
    await db.collection('observationSubmissions').createIndex({ createdBy: 1 }, { unique: true })
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
