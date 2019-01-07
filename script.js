// var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/sl-assessment";

// MongoClient.connect(
//   url,
//   function(err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     var dbo = db.db("sl-assessment");
//     const SubmissionCollection = dbo.collection("submissions");
//     SubmissionCollection.find({})
//       .project({ _id: 1 })
//       .toArray(function(err, docs) {
//         if (err) throw err;
//         let index = 0;
//         findAndUpdate(index);
//         function findAndUpdate(index) {
//           if (docs[index]) {
//             SubmissionCollection.findOne({ _id: docs[index]._id })
//               .then(data => {
//                 data["evidencesStatus"] = [];
//                 Object.values(data.evidences).forEach(singleEvidence => {
//                   data.evidencesStatus.push({
//                     name: singleEvidence.name,
//                     externalId: singleEvidence.externalId,
//                     tip: singleEvidence.tip,
//                     description: singleEvidence.description,
//                     startTime: singleEvidence.startTime,
//                     endTime: singleEvidence.endTime,
//                     isSubmitted: singleEvidence.isSubmitted,
//                     modeOfCollection: singleEvidence.modeOfCollection,
//                     canBeNotApplicable: singleEvidence.canBeNotApplicable,
//                     notApplicable: singleEvidence.notApplicable,
//                     canBeNotAllowed: singleEvidence.canBeNotAllowed,
//                     remarks: singleEvidence.remarks,
//                     hasConflicts: singleEvidence.hasConflicts
//                   });
//                 });
//                 delete data._id;
//                 dbo
//                   .collection("submissions-temp")
//                   .insertOne(data, function(err, res) {
//                     if (err) throw err;
//                     console.log(index, "document inserted");
//                     index++;
//                     findAndUpdate(index);
//                     if (!docs[index]) {
//                       db.close();
//                     }
//                   });
//               })
//               .catch(err => {
//                 console.log(err);
//               });
//           } else {
//             db.close();
//           }
//         }
//       });
//   }
// );

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/sl-assessment";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Connected to Database !")
  let db0 = db.db("sl-assessment");
  const programCollection = db0.collection("programs")
  const submissionCollection = db0.collection("submissions")


  submissionCollection.find({}).project({ _id: 1, programId: 1, schoolInformation: 1 }).toArray(function (err, submissionDocs) {

    if (err) throw err;
    let index = 0;
    findAndUpdate(index);
    function findAndUpdate(index) {


      if (submissionDocs[index]) {
        let schoolExternal_Id = submissionDocs[index].schoolInformation.externalId
        programCollection.findOne({ _id: submissionDocs[index].programId }).then(data => {

          delete data._id
          let findQuery = { programId: submissionDocs[index].programId, _id: submissionDocs[index]._id };
          let updateQuery = { $set: { programInformation: data, schoolExternalId: schoolExternal_Id } };
          db0.collection("submissions").updateOne(findQuery, updateQuery).then((res) => {

            console.log(index, "documents updated");
            index++;
            findAndUpdate(index);
            if (!submissionDocs[index]) {
              db.close();
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        db.close();
      }
    }

    // submissionDocs.forEach(eachSubmissionDoc => {
    //   console.log(eachSubmissionDoc)
    // })
  })
  // console.log(programInformationObject)


})
// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   console.log("Connected to Database!");
//   var dbo = db.db("sl-assessment");
//   const SubmissionCollection = dbo.collection("submissions")
//   SubmissionCollection.find({}).project({ _id: 1 }).toArray(function (err, docs) {
//     if (err) throw err;
//     let index = 0;
//     findAndUpdate(index);
//     function findAndUpdate(index) {
//       if (docs[index]) {
//         SubmissionCollection.findOne({ _id: docs[index]._id }).then(data => {
//           data['evidencesStatus'] = [];
//           Object.values(data.evidences).forEach(singleEvidence => {
//             delete singleEvidence.submissions;
//             data.evidencesStatus.push(singleEvidence);
//           })
//           let findQuery = { _id: docs[index]._id };
//           let updateQuery = { $set: { evidencesStatus: data.evidencesStatus } };
//           dbo.collection("submissions").updateOne(findQuery, updateQuery).then((res) => {
//             console.log("document id : ", data._id.toString());
//             console.log(index, "documents updated");
//             index++;
//             findAndUpdate(index);
//             if (!docs[index]) {
//               db.close();
//             }
//           }).catch(err => {
//             console.log(err);
//           })
//         }).catch(err => {
//           console.log(err)
//         })
//       } else {
//         db.close();
//       }
//     }
//   });
// });