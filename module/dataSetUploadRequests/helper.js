/**
 * name : dataSetUploadRequests/helper.js
 * author : Aman
 * created-date : 10-Jan-2020
 * Description : Bulk dataset upload helper functionality.
 */

 // Dependencies
 const dataSetRequestTracker = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/requestTracker");

/**
    * DataSetUploadRequestsHelper
    * @class
*/
module.exports = class DataSetUploadRequestsHelper {
    
     /**
   * Upload requests documents.
   * @method
   * @name dataSetUploadRequestDocuments
   * @param {String} findQuery - filter data.
   * @param {String} fields - Projected data required. 
   * @returns {Array} - Array of dataSetUploadRequest.
   */

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

    /**
    * Details of upload dataset.
    * @method
    * @name details
    * @param {String} requestId - All requested Data.
    * @returns {Object} - Uploaded dataset details information.
    */

    static details(requestId) {
        return new Promise(async (resolve, reject) => {
            try {

                if(!requestId) {
                    throw new Error(messageConstants.apiResponses.INVALID_REQUEST_ID);
                }

                // if(typeof requestId == "string") {
                //     requestId = ObjectId(requestId);
                // }

                let requestDocument = await this.dataSetUploadRequestDocuments({
                    _id:requestId
                });

                if(!requestDocument[0]) {
                    throw new Error(messageConstants.apiResponses.INVALID_REQUEST_ID);
                }

                return resolve({
                    success : true,
                    message : messageConstants.apiResponses.FETCH_REQUEST,
                    data : requestDocument[0]
                });

            }
            catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Create dataset requests document.
   * @method
   * @name create
   * @param {Object} requestData - consists of data set request documents.
   * @returns {Object} - returns request id.
   */

    static create(requestData) {
        return new Promise(async (resolve, reject) => {
            try {

                let requestedData = 
                await database.models.dataSetUploadRequests.create(requestData);

                let requestTracker = new dataSetRequestTracker(requestedData._id.toString());

                return resolve({
                    requestTracker : requestTracker
                });

            } catch (error) {
                return reject(error);
            }
        })

    }

    /**
   * Create dataset requests document.
   * @method
   * @name updateUploadedCsvData
   * @param {Number} sizeOfUploadedCsv -Size of csv data uploaded.
   * @param {String} requestId -requested id.
   * @param {String} fileName -path of the file where updated csv data exists.
   * @param {Number} recordsUploaded -How many csv records is been uploaded. 
   * @returns {Object} - returns updated csv data.
   */

    static updateUploadedCsvData(
        requestId
    ) {
            try {

                _update(requestId,{ status:"inProgress" },{
                    noOfRecordsUploaded : 1
                });
                
                return;

            } catch (error) {
                return error;
            }

    }

    static onSuccessOrFailureUpload(requestId,resultFilePath = "",failureRemarks = "",success = true,resultAsCsv = true) {
        try {

            let updateDataSet = {
                status : "completed" ,
                remarks : "Successfully uploaded csv."
            };

            if(success && resultAsCsv) {
                updateDataSet.remarks = "You can download the csv file";
                updateDataSet["resultFileUrl"] = resultFilePath;
            } else if(!success) {
                updateDataSet.status = "Fail";
                updateDataSet.remarks = failureRemarks;
            } 
    
            _update(requestId,updateDataSet);
            return;
        } catch(error) {
            console.log(error)
        }
    }
};

function _update(requestId,updateObj,incrementUpload = {}) {

    let updatedData = {
        $set:updateObj
    };
    if( incrementUpload && !(_.isEmpty(incrementUpload)) ) {
        updatedData["$inc"] = incrementUpload;
    }
    database.models.dataSetUploadRequests.findOneAndUpdate(
        {_id : requestId},updatedData
    ).then();
    return;
}