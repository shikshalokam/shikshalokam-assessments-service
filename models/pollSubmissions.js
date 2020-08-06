module.exports = {
    name: "pollSubmissions",
    schema: {
      pollName: String,
      responses: Array,
      submittedAt: Date,
      pollId: "ObjectId",
      userId: {
        type: String,
        required: true
      },
      isDeleted: {
        type: Boolean,
        default: false
      }
    },
    status: String
};