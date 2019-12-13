module.exports = class dataSetUploadRequestsHelper {

    static dataSetUploadRequestDocuments(findQuery = "all", fields = "all") {
        return new Promise(async (resolve, reject) => {
            try {
                let queryObject = {};

                if (findQuery != "all") {
                    queryObject = _.merge(queryObject, findQuery)
                }

                let projectionObject = {};

                if (fields != "all") {
                    fields.forEach(element => {
                        projectionObject[element] = 1;
                    });
                }

                let dataSetUploadRequestDocuments = await database.models.dataSetUploadRequests.find(queryObject, projectionObject).lean();

                return resolve(dataSetUploadRequestDocuments);

            } catch (error) {
                return reject(error);
            }
        });
    }
    
    static details(requestId = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(requestId == "") throw new Error("Invalid request ID.")

                if(typeof requestId == "string") {
                    requestId = ObjectId(requestId)
                }

                let requestDocument = await this.dataSetUploadRequestDocuments({
                    _id:requestId
                });

                if(!requestDocument[0]) throw new Error("Invalid request ID.")

                return resolve({
                    success : true,
                    message : "Request document fetched successfully.",
                    data : requestDocument[0]
                });

            }
            catch (error) {
                return reject(error);
            }
        })
    }

    static create(requestData) {
        return new Promise(async (resolve, reject) => {
            try {

                let requestData = await database.models.observations.create(
                    _.merge(data, {
                        "solutionId": solutionDocument._id,
                        "solutionExternalId": solutionDocument.externalId,
                        "frameworkId": solutionDocument.frameworkId,
                        "frameworkExternalId": solutionDocument.frameworkExternalId,
                        "entityTypeId": solutionDocument.entityTypeId,
                        "entityType": solutionDocument.entityType,
                        "author": userDetails.id,
                        "updatedBy": userDetails.id,
                        "createdBy": userDetails.id
                    })
                );

                return resolve(_.pick(observationData, ["_id", "name", "description"]));

            } catch (error) {
                return reject(error);
            }
        })

    }

};