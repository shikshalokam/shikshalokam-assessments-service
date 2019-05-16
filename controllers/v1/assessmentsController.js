const assessmentsHelper = require(ROOT_PATH + "/module/assessments/helper");
module.exports = class Assessments {

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

      try {

        let result = await assessmentsHelper.list(req.query.type, req.query.subType, req.userDetails.id, req.userDetails.userRole);

        return resolve({
          result: result
        });

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


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


      try {

        let result = await assessmentsHelper.details(req.params._id, req.query.assessmentId, req.userDetails.id, req.headers["user-agent"]);

        return resolve({
          result: result
        });

      } catch (error) {

        return reject({
          status: error.status || 500,
          message: error.message || "Oops! something went wrong.",
          errorObject: error
        })

      }


    })

  }

}
