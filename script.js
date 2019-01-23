let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/sl-assessment";

MongoClient.connect(url, function (err, db) {
    let dbo = db.db("sl-assessment");
    const SubmissionCollection = dbo.collection("parent-registry")
    SubmissionCollection.find({}).project({ type: 1 }).toArray((err, submissionData) => {
        submissionData.forEach(eachSubmission => {
            let findQuery = { _id: eachSubmission._id }
            let updateQuery = { $set: { type: [eachSubmission.type] } }
            SubmissionCollection.updateOne(findQuery, updateQuery).then(() => {
                console.log("updated successfully")
            })
        })
    })
});