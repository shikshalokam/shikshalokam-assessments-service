module.exports = {
  name: "polls",
  schema: {
    link: UUID(),
    pollName: String,
    creator: {
        type: String,
        required: true
      },
    questions: Array,
    organizationName: String,
    createdAt: Date,
    updatedAt: Date,
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