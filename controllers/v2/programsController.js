/**
 * name : programsController.js
 * author : Aman
 * created-date : 02-Jun-2020
 * Description : Programs related information
 */

 // Dependencies
 const programsHelper = require(MODULES_BASE_PATH + "/programs/helper");
 const v1Programs = require(ROOT_PATH + "/controllers/v1/programsController");
 
 /**
     * Programs
     * @class
 */
 
 module.exports = class Programs extends v1Programs { 
     
    /**
      * @api {get} /assessment/api/v2/programs/list/:userId Programs list
      * @apiVersion 1.0.0
      * @apiName Programs list
      * @apiGroup Programs
      * @apiHeader {String} X-authenticated-user-token Authenticity token
      * @apiSampleRequest /assessment/api/v1/programs/list/e97b5582-471c-4649-8401-3cc4249359bb
      * @apiParamExample {json} Response:
      * {
      * "message": "Program information list fetched successfully.",
      * "status": 200,
      * "result": [
      * {
      * "_id": "5b98d7b6d4f87f317ff615ee",
      * "externalId": "PROGID01",
      * "name": "DCPCR School Development Index 2018-19",
      * "description": "DCPCR School Development Index 2018-19"
      * },
      * {
      * "_id": "5ed4d12e19bff00a268cd382",
      * "externalId": "Aman",
      * "name": "Aman",
      * "description": "Aman program"
      * }
      * ]
      * }
      * @apiUse successBody
      * @apiUse errorBody
      */    /**
     * Programs list.
     * @method
     * @name list
     * @param {Object} req -request Data.
     * @returns {JSON} - List of programs created by user.
     */ 
    
     async list(req) {     
         return new Promise(async (resolve, reject) => {      
            try {               
                
                let programsData = 
                 await programsHelper.userCreatedPrograms(
                 (req.params._id && req.params._id != "") ? req.params._id : req.userDetails.userId
                 );               
                     
                return resolve(programsData);         
            
            } catch (error) {
                 return reject({
                     status: error.status || httpStatusCode.internal_server_error.status,
                     message: error.message || httpStatusCode.internal_server_error.message,
                     errorObject: error
                 });
             }        
        });   
    }
}