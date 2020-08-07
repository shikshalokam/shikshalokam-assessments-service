module.exports = {
  async up(db) {
    
    const kendraServiceHelper = require("../generics/services/kendra");

    global.migrationMsg = "Upload emojis";

    let emojis = [
      {
        name : "smiley",
        type : "emoji",
        code : Math.floor(100000 + Math.random() * 900000),
        icon : "smiley.jpeg",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        isDeleted : false,
        status : "active"
      }
    ];

    for( let emoji = 0 ; emoji < emojis.length; emoji++ ) {

      await kendraServiceHelper.upload(
        `public/assets/mediaFiles/emoji/${emojis[emoji].icon}`,
        `static/mediaFiles/emoji/${emojis[emoji].icon}`
      );

      emojis[emoji].icon = "static/mediaFiles/emoji/" + emojis[emoji].icon; 
    }

    await db.collection('mediaFiles').insertMany(emojis);
    
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
