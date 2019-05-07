const csv = require("csvtojson");
const assessmentsHelper = require(ROOT_PATH + "/module/assessments/helper");
module.exports = class Assessment {

  constructor() {
    this.assessmentsHelper = new assessmentsHelper();
  }
  /**
   * @apiDefine errorBody
   * @apiError {String} status 4XX,5XX
   * @apiError {String} message Error
   */

  /**
     * @apiDefine successBody
     *  @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */

  /**
  * @api {get} /assessment/api/v1/assessments/list?type={assessment}&subType={individual}&status={active} Individual assessment list
  * @apiVersion 0.0.1
  * @apiName Individual assessment list
  * @apiGroup IndividualAssessments
  * @apiParam {String} type Type.
  * @apiParam {String} subType SubType.
  * @apiParam {String} status Status.
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/assessments/list
  * @apiUse successBody
  * @apiUse errorBody
  */

  list(req) {
    return new Promise(async (resolve, reject) => {

      let result;

      try {

        result = await this.assessmentsHelper.list(req.query, req.userDetails);

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }

      return resolve({
        result: result
      });

    })
  }

  /**
  * @api {get} /assessment/api/v1/assessments/details/{programID}?assessmentId={assessmentID} Detailed assessments
  * @apiVersion 0.0.1
  * @apiName Individual assessment details
  * @apiGroup IndividualAssessments
  * @apiParam {String} assessmentId Assessment ID.
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/assessments/details/:programID
  * @apiUse successBody
  * @apiUse errorBody
  */

  async details(req) {

    return new Promise(async (resolve, reject) => {

      let result;

      try {

        result = await this.assessmentsHelper.details(req.params._id, req.query.assessmentId, req.userDetails.id, req.headers["user-agent"]);

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }

      return resolve({
        result: result
      });

    })

  }

  /**
 * @api {post} /assessment/api/v1/assessments/details/{programID}?assessmentId={assessmentID} Upload assessments
 * @apiVersion 0.0.1
 * @apiName Upload individual assessment
 * @apiGroup IndividualAssessments
* @apiParamExample {json} Request-Body:
* 	Upload CSV
* @apiUse successBody
* @apiUse errorBody
*/

  async upload(req) {

    return new Promise(async (resolve, reject) => {

      let result;

      try {

        result = await this.assessmentsHelper.upload(req);

      } catch (error) {

        return reject(error)

      }

      return resolve(result);

    })

  }

}
