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

                let dataSetUploadRequestDocuments = 
                await database.models.dataSetUploadRequests
                .find(queryObject, projectionObject).lean();

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

                let requestedData = 
                await database.models.dataSetUploadRequests.create(requestData);

                return resolve({
                    requestId : requestedData._id
                });

            } catch (error) {
                return reject(error);
            }
        })

    }

    static _update(requestId,updateData) {
        return new Promise(async (resolve, reject) => {
            try {

                let requestedData = 
                await database.models.dataSetUploadRequests.
                findOneAndUpdate({
                    _id : requestId
                },{$set:updateData}).lean();

                return resolve(requestedData);

            } catch (error) {
                return reject(error);
            }
        })

    }

    static updateUploadedCsvData(
        sizeOfUploadedCsv,
        requestId,
        fileName,
        recordsUploaded
    ) {
        return new Promise(async (resolve,reject)=>{
            try {

                let noOfRecordsUploaded = recordsUploaded;

                let noOfRecordsToUpload = 
                sizeOfUploadedCsv - noOfRecordsUploaded;

                let updateRequestDocument = {
                    noOfRecordsUploaded:
                    noOfRecordsUploaded,

                    noOfRecordsToUpload : noOfRecordsToUpload,

                    resultFileUrl : fileName,

                    status : noOfRecordsToUpload === 0 ? "completed" :
                    "inProgress"
                }

                let updatedDocument = 
                await database.models.dataSetUploadRequests.findOneAndUpdate({
                        _id : requestId
                    },{$set:updateRequestDocument}
                );

                return resolve(updatedDocument);

            } catch (error) {
                return reject(error);
            }
        })

    }

  
        

};