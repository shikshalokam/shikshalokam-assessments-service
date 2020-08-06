module.exports = {
    name: "polls",
    schema: {
        name: String,
        path: String,
        type: String,
        code: Number,
        status: String,
        createdAt: Date,
        updatedAt: Date,
        createdBy: Date,
        updatedBy: Date,
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
}