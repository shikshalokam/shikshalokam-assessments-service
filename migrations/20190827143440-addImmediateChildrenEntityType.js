module.exports = {
  async up(db) {
    global.migrationMsg = "Add immediate children entity types."

    let entityTypeDocuments = await db.collection('entityTypes').find({}).project({ name: 1 }).toArray();

    let childrenEntityTypes = {
      "cluster":["school"],
      "block":["cluster"],
      "district":["block"],
      "state":["district"],
      "country":["state"]
    }

    await Promise.all(entityTypeDocuments.map(async entityType => {
      if (childrenEntityTypes[entityType.name]) {
        await db.collection('entityTypes').updateOne({ _id: entityType._id }, { $set: { immediateChildrenEntityType: childrenEntityTypes[entityType.name] } });
      }
    }));

    return
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
