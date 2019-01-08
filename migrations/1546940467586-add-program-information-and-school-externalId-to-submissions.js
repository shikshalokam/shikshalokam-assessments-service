'use strict'
require('../config/loadModelsAndControllers')
const version = parseFloat(process.argv[2]);
if(!version) throw "Please provide version";
module.exports.up = function (next) {

    console.log("version : ", version);

    let migrationStatusData = {
        version: version,
        startTime: new Date
    }

    database.models.submissions.find({}, { _id: 1, programId: 1, schoolInformation: 1 }).then((submissionDocs) => {
        let index = 0;
        findAndUpdate(index);
        function findAndUpdate(index) {
            if (submissionDocs[index]) {
                let schoolExternalId = submissionDocs[index].schoolInformation.externalId;
                database.models.submissions.findOne({ _id: submissionDocs[index].programId }).then(data => {
                    if (!data) {
                        console.log(`skipping ${submissionDocs[index].schoolInformation.externalId}`)
                        index++;
                        findAndUpdate(index);
                    } else {
                        delete data._id
                        let findQuery = { programId: submissionDocs[index].programId, _id: submissionDocs[index]._id };
                        let updateQuery = { $set: { dataVersion:version,programInformation: data, schoolExternalId: schoolExternalId } };
                        database.models.submissions.updateOne(findQuery, updateQuery).then((res) => {
                            console.log(index, "documents updated");
                            index++;
                            findAndUpdate(index);
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                migrationStatusData.migrationEndTime = new Date;
                migrationStatusData.endTime = new Date;
                migrationStatusData.migrationName = 'add-program-information-and-school-externalId-to-submissions';
                migrationStatusData.timeTaken = Math.abs(migrationStatusData.endTime - migrationStatusData.startTime);
                gen.utils.createMigrationStatus(migrationStatusData).then(() => {
                    console.log('migration status created')
                    next();
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }).catch(err => {
        console.log(err)
    });
}

module.exports.down = function (next) {
    next()
}
