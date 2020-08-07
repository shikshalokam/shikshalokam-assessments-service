module.exports = {
    name: "mediaFiles",
    schema: {
        name: String,
        path: String,
        type: String,
        code: {
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