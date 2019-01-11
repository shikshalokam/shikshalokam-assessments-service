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
    database.models.submissions.find({}, { _id: 1 }).then((docs) => {
        let index = 0;
        findAndUpdate(index);
        function findAndUpdate(index) {
            if (docs[index]) {
                let queryParams = { _id: docs[index]._id, dataVersion: { $lt: version } };
                database.models.submissions.findOne(queryParams).then(data => {
                    if (!data) {
                        console.log(`skipping ${docs[index]._id}`)
                        index++;
                        findAndUpdate(index);
                    } else {
                        data['evidencesStatus'] = [];
                        Object.values(data.evidences).forEach(singleEvidence => {
                            delete singleEvidence.submissions;
                            data.evidencesStatus.push(singleEvidence);
                        })
                        let findQuery = { _id: docs[index]._id };
                        let updateQuery = { $set: { dataVersion: version, evidencesStatus: data.evidencesStatus } };
                        database.models.submissions.updateOne(findQuery, updateQuery, { upsert: true }).then((res) => {
                            console.log("document id : ", data._id.toString());
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
                migrationStatusData.endTime = new Date;
                migrationStatusData.migrationName = 'add-evidences-status-to-submissions';
                migrationStatusData.timeTaken = Math.abs(migrationStatusData.endTime - migrationStatusData.startTime);
                gen.utils.createMigrationStatus(migrationStatusData).then(() => {
                    console.log('migration status created');
                    next();
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }).catch(err => {
        console.log(err);
    });
}

module.exports.down = function (next) {
    next();
}
