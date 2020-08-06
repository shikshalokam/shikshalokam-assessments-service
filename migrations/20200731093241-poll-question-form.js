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
            value : "mutlselect",
            label : "Multiselect"
          },
          {
            value : "emoji",
            label : "Emoji"
          },
          {
            value : "gestures",
            label : "Gestures"
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
      },
      {
        field : "options",
        label : "Options",
        value : "",
        visible : false,
        editable : true,
        validation : {
          required : true
        },
        input : "multiselect"
      },
      {
        field : "text-option",
        label : "Text option",
        value : "",
        visible : false,
        editable : true,
        validation : {
        required : true,
          visibleIf : {
            value : "radio||multiselect",
            operator : "===",
            _id : "responseType"
          }
            
        },
        input : "multiselect"
      },
          {
         field : "emoji-option",
         label : "Emoji option",
         value : "",
         visible : false,
         editable : true,
         validation : {
         required : true,
            visibleIf : {
                value : "emoji",
                operator : "===",
                _id : "responseType"
            }
        },
        input : "emojis"
      },
          {
         field : "gesture-option",
         label : "Gesture option",
         value : "",
         visible : false,
         editable : true,
         validation : {
         required : true,
            visibleIf : {
                value : "gestures",
                operator : "===",
                _id : "responseType"
            }
        },
        input : "gestures"
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
