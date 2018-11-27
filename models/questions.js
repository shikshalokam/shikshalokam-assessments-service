module.exports = {
  name: "questions",
  schema: {
    externalId: {
      type: String,
      index: true,
      unique: true
    },
    question: Array,
    tip: "String",
    responseType: "String",
    value: "String",
    isCompleted: Boolean,
    showRemarks: Boolean,
    remarks: "String",
    visibleIf: Object,
    createdBy: "String",
    // createdDate: { type: Date, default: Date.now },
    updatedBy: "String",
    // updatedDate: { type: Date, default: Date.now },
    options: Array,
    children: Array,
    questionGroup: Array,
    questionType: "String",
    modeOfCollection: "String",
    usedForScoring: "String",
    file: Object,
    fileName: Array,
    validation: Object,
    accessibility: "String",
    instanceIdentifier: "String",
    noOfInstances: "number",
    notApplicable: "String",
    canBeNotApplicable: "String",
    instanceQuestionsString: "String",
    instanceQuestions: Array
  }
};
