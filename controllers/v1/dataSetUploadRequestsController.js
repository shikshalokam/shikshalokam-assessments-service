/**
 * name : dataSetUploadRequestsController.js
 * author : Aman
 * created-date : 10-Jan-2020
 * Description : Bulk dataset upload.
 */


// Dependencies.
const dataSetUploadRequestsHelper = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");

module.exports = class DataSetUploadRequests extends Abstract {
  
  constructor() {
    super(dataSetUploadRequestsSchema);
  }

  static get name() {
    return "dataSetUploadRequests";
  }

  /**
  * @api {get} /assessment/api/v1/dataSetUploadRequests/status/:requestId 
  * Data Set Upload Request Status
  * @apiVersion 1.0.0
  * @apiName Data Set Upload Request Status
  * @apiGroup Data Set Upload Requests
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/dataSetUploadRequests/status/5bfe53ea1d0c350d61b78d0a
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
      * Check the status of the csv file uploaded.
      * @method
      * @name status
      * @param {Request} req - requested data.
      * @param {Request} req.params._id - request id. 
      * @returns {Object} consists of status of the file uploaded.
  */

  status(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await dataSetUploadRequestsHelper.details(req.params._id);

        if(result.success) {
          return resolve({
            message: messageConstants.apiResponses.INFORMATION_FETCHED,
            result: _.omit(result.data,["headers","createdAt","updatedAt","__v"])
          });
        } else {
          throw new Error(result.message)
        }

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error
        })

      }

    })
  }
  
};