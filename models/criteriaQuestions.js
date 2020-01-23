module.exports = {
    name: "criteriaQuestions",
    schema: {
        externalId: String,
        owner: String,
        timesUsed: Number,
        weightage: Number,
        name: String,
        score: String,
        remarks: String,
        showRemarks: Boolean,
        description: String,
        resourceType: [String],
        language: [String],
        keywords: [String],
        concepts: ["json"],
        createdFor: [String],
        createdFor: [String],
        rubric: Object,
        evidences: ["json"],
        flag: Object,
        criteriaType: String,
        frameworkCriteriaId: "ObjectId"
    }
};
