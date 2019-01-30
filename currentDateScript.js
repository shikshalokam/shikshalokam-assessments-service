let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/";
let _ = require("lodash")


MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    let dbo = db.db("sl-assessment");
    const submissionsCollection = dbo.collection("submissions")

    submissionsCollection.find({}).project({ _id: 1 }).toArray((err, submissionData) => {
        let chunkOfSubmissionData = _.chunk(submissionData, 10)
        let evidenceCount = 0;
        for (let pointerToChunkData = 0; pointerToChunkData < chunkOfSubmissionData.length; pointerToChunkData++) {
            let submissionIds = chunkOfSubmissionData[pointerToChunkData].map(submissionId => {
                return submissionId._id
            })

            submissionsCollection.find({ _id: { $in: submissionIds } }).project({ evidences: 1 }).toArray((err, submissionDocuments) => {


                submissionDocuments.forEach(eachSubmission => {
                    eachSubmission['evidenceStatus'] = []
                    Object.values(eachSubmission.evidences).forEach(singleEvidence => {
                        eachSubmission.evidenceStatus.push(singleEvidence)
                        if (singleEvidence.submissions) {
                            singleEvidence.submissions.forEach(eachIndividualSubmission => {
                                delete eachIndividualSubmission.answers
                            });
                        }
                    })
                    let findQuery = { _id: eachSubmission._id }
                    let updateQuery = { $set: { evidencesStatus: eachSubmission.evidenceStatus } }
                    submissionsCollection.update(findQuery, updateQuery).then(() => {
                        console.log(`updating evidence ${evidenceCount++}`)
                        if (submissionData.length == evidenceCount) {
                            console.log("Done")
                        }
                    })
                })
            })
        }
    })
}) 