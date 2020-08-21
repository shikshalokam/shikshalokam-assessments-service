module.exports = {
    name: "mediaFiles",
    schema: {
        name: String,
        type: String,
        unicode: {
            type: String,
            index: true,
            unique: true
          },
        status: String,
        createdBy: String,
        updatedBy: String,
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
}