module.exports = {
  async up(db) {
    global.migrationMsg = "Create dummy question weightage and option scores."

    // let currentQuestionCollection = await db.collection('questions').find({
    //   "responseType": {
    //     $in : [
    //       "radio",
    //       "multiselect",
    //       "slider"
    //     ]
    //   }
    // }).project({options: 1}).toArray();


    // currentQuestionCollection.forEach( async (question) => {
    //   if(question.options && question.options.length >0) {
    //     question.options.forEach(option => {
    //       option.score = Math.ceil(Math.random() * 10)
    //     })
    //   }
    //   question.weightage = Math.ceil(Math.random() * 10)
    //   await db.collection('questions').findOneAndUpdate(
    //     {
    //       _id : question._id
    //     },
    //     {
    //       $set: { "weightage": question.weightage, "options":question.options  }
    //     }
    //   )
    // });

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
