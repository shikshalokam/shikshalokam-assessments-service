module.exports = {
  name: "submissions",
  schema: {
    entityId: "ObjectId",
    programId: "ObjectId",
    assessors: Array,
    status: "String",
    evidencesStatus: Array,
    evidences: Object,
    criteria: Array,
    answers: Object,
    entityExternalId: "String",
    entityInformation: Object,
    programExternalId: "String",
    programInformation: Object,
    entityProfile: Object,
    ratingOfManualCriteriaEnabled: Boolean,
    allManualCriteriaRatingSubmitted: Boolean,
    feedback: Array,
    generalQuestions: Object,
    parentInterviewResponsesStatus: Array,
    parentInterviewResponses: Object,
    completedDate: Date,
    solutionId: "ObjectId",
    solutionExternalId: String,
    submissionsUpdatedHistory: Array,
    ratingCompletedAt: Date,
    entityTypeId: "ObjectId",
    entityType: "String"
  }
};
