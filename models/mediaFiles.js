module.exports = {
    name: "mediaFiles",
    schema: {
        name: {
          type: String,
          required: true,
          index: true
        },
        type: String,
        unicode: String,
        status: String,
        createdBy: String,
        updatedBy: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
}