module.exports = {
  name: "polls",
  schema: {
    name: String,
    creator: String,
    createdBy: {
      type: String,
      required: true,
      index: true
    },
    questions: Array,
    link: {
      type: String,
      index: true
    },
    result: Object,
    numberOfResponses: Number,
    metaInformation: Object,
    isDeleted: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    status: String
  }
};