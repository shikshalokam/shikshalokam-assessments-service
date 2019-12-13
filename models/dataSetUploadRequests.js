module.exports = {
  name: "dataSetUploadRequests",
  schema: {
    url: String,
    headers: Object,
    status: { type : String, default: "started" },
    noOfRecordsToUpload: { type : Number, default: 0},
    noOfRecordsUploaded: { type : Number, default: 0},
    completedAt: Date,
    remarks: { type : String, default: ""},
    resultFileUrl: { type : String, default: ""}
  }
};
