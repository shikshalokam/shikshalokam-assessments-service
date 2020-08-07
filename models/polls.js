module.exports = {
  name: "polls",
  schema: {
    pollName: String,
    creator: {
        type: String,
        required: true
      },
    questions: Array,
    organizationName: String,
    link: String,
    numberOfResponses: Number,
    isDeleted: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    status: String
  
  }
};