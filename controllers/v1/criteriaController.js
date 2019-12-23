/**
 * name : configurations
 * author : Akash
 * created-date : 18-Dec-2018
 * Description : Configurations.
 */

// Dependencies

const csv = require("csvtojson");
const FileStream = require(ROOT_PATH + "/generics/fileStream");
const criteriaHelper = require(ROOT_PATH + "/module/criteria/helper");

 /**
    * Criteria
    * @class
*/

module.exports = class Criteria extends Abstract {

  constructor() {
    super(criteriaSchema);
  }

  static get name() {
    return "criteria";
  }

  /**
  * @api {post} /assessment/api/v1/criteria/upload Upload Criteria CSV
  * @apiVersion 1.0.0
  * @apiName Upload Criteria CSV
  * @apiGroup Criteria
  * @apiParam {File} criteria Mandatory criteria file of type CSV.
  * @apiUse successBody
  * @apiUse errorBody
  */

   /**
      * upload criteria via csv.
      * @method
      * @name upload
      * @param  {Request} req request body.
      * @returns {JSON} Response consists of message and result.
    */

  async upload(req) {
    return new Promise(async (resolve, reject) => {
      try {

        if (!req.files || !req.files.criteria) {
          throw "Csv file for criterias should be selected"
        }

        if(req.file && req.file === "criteria") {
          await criteriaHelper.upload(req.csvData,req.userDetails.id,req.requestId);
        }

      }
      catch (error) {
        return reject({
          status: 500,
          message: error,
          errorObject: error
        });
      }
    })
  }

};



