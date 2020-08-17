module.exports = {
  name: "polls",
  schema: {
    name: String,
    creator: {
      type: String,
      required: true,
      index: true
    },
    questions: Array,
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