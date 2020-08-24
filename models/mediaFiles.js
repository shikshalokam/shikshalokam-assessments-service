module.exports = {
    name: "mediaFiles",
    schema: {
        name: {
          type: String,
          required: true,
          index: true
        },
        type: {
          type: String,
          required: true
        },
        unicode: {
          type: String,
          required: true
        },
        status: {
           type: String,
           required: true
        },
        createdBy: String,
        updatedBy: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
}