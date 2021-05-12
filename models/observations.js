module.exports = {
  name: "observations",
  schema: {
    name: String,
    description: String,
    createdBy: {
      type : String,
      index : true
    },
    frameworkId: "ObjectId",
    frameworkExternalId: String,
    solutionId: {
      type : "ObjectId",
      index : true
    },
    programId: {
      type: "ObjectId",
      required: true,
      index : true
    },
    programExternalId: {
      type: String,
      required: true,
      index : true
    },
    solutionExternalId: {
      type : String,
      index : true
    },
    startDate: Date,
    endDate: Date,
    status: {
      type : String,
      index : true
    },
    entityTypeId: {
      type : "ObjectId",
      index : true
    },
    entityType : String,
    entities: Array,
    createdFor: [String],
    rootOrganisations: [String],
    isAPrivateProgram : {
      default : false,
      type : Boolean
    },
    link: {
      type: String,
      index: true
    },
    project : Object,
    referenceFrom : String,
    language: Array,
    region: String
  }
};