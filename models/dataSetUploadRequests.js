module.exports = {
  name: "dataSetUploadRequests",
  schema: {
    url: String,
    headers: Object,
    status: { type : String, default: "started" },
    noOfRecordsUploaded: { type : Number, default: 0},
    completedAt: Date,
    remarks: { type : String, default: ""},
    resultFileUrl: { type : String, default: ""},
    totalSize : { type : Number, default : 0 }
  }
};