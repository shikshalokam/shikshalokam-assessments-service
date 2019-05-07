const csv = require("csvtojson");
module.exports = class Assessments {

    constructor(){
        this.assessmentsHelper = new assessmentsHelper;
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

        result = await this.assessmentsHelper.list(req);

      } catch (error) {

        return reject(error)

      }

      return resolve(result);

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
      
              result = await this.assessmentsHelper.details(req);
      
            } catch (error) {
      
              return reject(error)
      
            }
      
            return resolve(result);
      
          })

    }
    
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
