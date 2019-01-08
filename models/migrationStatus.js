module.exports = {
    name: "migration-status",
    schema: {
        version: Number,
        migrationName: "String",
        startTime: { type : Date, default: Date.now },
        endTime: { type : Date, default: Date.now },
        timeTaken: Number
    }
};
