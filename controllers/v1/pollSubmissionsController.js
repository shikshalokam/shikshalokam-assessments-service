/**
 * name : pollSubmissionsController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Poll Submissions information
 */

// Dependencies
const pollSubmissionsHelper = require(MODULES_BASE_PATH + "/pollSubmissions/helper");


/**
    * PollSubmissions
    * @class
*/
module.exports = class PollSubmissions extends Abstract {

    constructor() {
        super(pollSubmissionsSchema);
    }

    static get name() {
        return "pollSubmissions";
    }

    /**
     * @api {post} /assessment/api/v1/pollSubmissions/make/:pollId  Poll Submission
     * @apiVersion 1.0.0
     * @apiName Poll Submission
     * @apiGroup pollSubmissions
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/pollSubmissions/make/5b98fa069f664f7e1ae7498c
     * @apiParamExample {json} Request-Body:
     * [{
         "qid": "",
         "value": [""] 
        }]
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll submitted successfully"
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Poll Submission
    * @method
    * @name make
    * @param {Object} req - request Data. 
    * @param {String} req.params._id - pollId
    * @param {Array} req.body - Questions and answers
    * @returns {String} - message
    */

   make(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await pollSubmissionsHelper.make(
                req.params._id,
                req.body
            );

            return resolve({
                message: messageConstants.apiResponses,
                result: result
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}

   
    /**
     * @api {get} /assessment/api/v1/pollSubmissions/listPollNames List Poll Names
     * @apiVersion 1.0.0
     * @apiName List Poll Names
     * @apiGroup pollSubmissions
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/pollSubmissions/listPollNames
     * @apiParamExample {json} Response:
     * {
     *   "status": 200,
     *   "message": "Poll names fetched successfully",
     *   "result": [{
     *        "pollId": "",
     *        "pollName": "",
     *        "organisationName": ""
     *    }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * List Poll Names
    * @method
    * @name listPollNames
    * @param {Object} req -request Data. 
    * @returns {JSON} - list of poll names 
    */

   listPollNames(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await pollSubmissionsHelper.listPollNames(
                req.userDetails.userId
            );

            return resolve({
                message: messageConstants.apiResponses.POLL_NAMES_FETCHED,
                result: result
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}
    
    /**
     * @api {get} /assessment/api/v1/pollSubmissions/report/:pollId Poll Report
     * @apiVersion 1.0.0
     * @apiName Poll Report
     * @apiGroup pollSubmissions
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/pollSubmissions/report/5f2bcc04456a2a770c4a5f3b
     * @apiParamExample {json} Request-Body:
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Poll Report
    * @method
    * @name report
    * @param {Object} req - request Data. 
    * @param {String} req.params._id - pollId
    * @returns {JSON} - chart data
    */

    report(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await pollSubmissionsHelper.report(
                req.params._id
            );

            return resolve({
                message: messageConstants.apiResponses,
                result: result
            });

        } catch (error) {

            return reject({
                status: error.status || httpStatusCode.internal_server_error.status,
                message: error.message || httpStatusCode.internal_server_error.message,
                errorObject: error
            });
        }
    })
}


}