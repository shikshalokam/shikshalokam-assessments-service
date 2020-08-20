module.exports = {
    name: "mediaFiles",
    schema: {
        name: String,
        type: String,
        unicode: {
            type: Number,
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