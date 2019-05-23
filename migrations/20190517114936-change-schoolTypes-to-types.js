module.exports = {
  async up(db) {
    global.migrationMsg = "Change school types to types in entities, submissions and solutions."

    await db.collection('solutions').updateMany( {}, { $rename: { "schoolProfileFieldsPerSchoolTypes": "entityProfileFieldsPerEntityTypes" } } )

    await db.collection('submissions').updateMany( {}, { $rename: { "entityInformation.schoolTypes": "entityInformation.types" } } )

    await db.collection('entities').updateMany( {}, { $rename: { "metaInformation.schoolTypes": "metaInformation.types" } } )

    return await db.collection('entities').updateMany( {}, { $rename: { "metaInformation.type": "metaInformation.types" } } )
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
