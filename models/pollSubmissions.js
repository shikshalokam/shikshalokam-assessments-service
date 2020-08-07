module.exports = {
    name: "pollSubmissions",
    schema: {
      pollName: String,
      responses: Array,
      submittedAt: Date,
      pollId: {
        type: "ObjectId",
        index: true,
      },
      userId: {
        type: String,
        required: true,
        index: true
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      status: String
    }
    
};