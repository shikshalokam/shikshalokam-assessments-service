module.exports = {
  async up(db) {
    
    global.migrationMsg = "Add default poll question form";

    let defaultPollQuestionForm = [
      {
        field : "responseType",
        label : "Choose response type",
        value : "",
        visible : true,
        editable : true,
        validation : {
          required : true
        },
        input : "radio",
        options : [
          {
            value : "radio",
            label : "Single select"
          },
          {
            value : "multiselect",
            label : "Multiselect"
          },
          {
            value : "emoji",
            label : "Emoji"
          },
          {
            value : "gesture",
            label : "Gesture"
          }
        ]
  
      },
      {
        field : "question",
        label : "Question",
        value : "",
        visible : true,
        editable : true,
        validation : {
          required : true
        },
        input : "text"
      }
    ]

    await db.collection('forms').insertOne({
      name: "defaultPollQuestionForm",
      value: defaultPollQuestionForm
    });
      
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
