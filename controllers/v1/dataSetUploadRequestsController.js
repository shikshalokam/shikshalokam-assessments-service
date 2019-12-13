const dataSetUploadRequestsHelper = require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper")

module.exports = class DataSetUploadRequests extends Abstract {
  
  constructor() {
    super(dataSetUploadRequestsSchema);
  }

  static get name() {
    return "dataSetUploadRequests";
  }

  /**
  * @api {get} /assessment/api/v1/dataSetUploadRequests/status/:requestId Data Set Upload Request Status
  * @apiVersion 1.0.0
  * @apiName Data Set Upload Request Status
  * @apiGroup Data Set Upload Requests
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/dataSetUploadRequests/status/5bfe53ea1d0c350d61b78d0a
  * @apiUse successBody
  * @apiUse errorBody
  */

  status(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await dataSetUploadRequestsHelper.details(req.params._id);

        if(result.success) {
          return resolve({
            message: "Information fetched successfully.",
            result: result.data
          });
        } else {
          throw new Error(result.message)
        }

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }

    })
  }
  
};
