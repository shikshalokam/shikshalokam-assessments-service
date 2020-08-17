module.exports = {
    name: "unicodes",
    schema: {
      description: String,
      tye: String,
      unicode: String,
      createdBy: Date,
      updatedBy: Date,
      isDeleted: {
        type: Boolean,
        default: false
      },
      status: String
    }
};