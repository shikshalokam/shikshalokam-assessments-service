module.exports = {
  async up(db) {

    global.migrationMsg = "Add default poll creation form";

    let defaultPollCreationForm = [
      {
        field: "name",
        label: "Name of the Poll",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "creator",
        label: "Name of the Creator",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "organisations",
        label: "Name of the Organization",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "radio",
        options: [
          {
            value: "12345",
            label: "Shikshalokam"
          },
          {
            value: "24367",
            label: "Mantra"
          }
        ]

      },
      {
        field: "startDate",
        label: "startDate",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "date",
        dateformat: "DD-MM-YYYY"
      },
      {
        field: "endDate",
        label: "endDate",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "date",
        dateformat: "DD-MM-YYYY"
      },
    ]

    await db.collection('forms').insertOne({
      name: "defaultPollCreationForm",
      allowMultipleQuestions: false,
      value: defaultPollCreationForm
    });

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
