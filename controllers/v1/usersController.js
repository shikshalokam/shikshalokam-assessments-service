/**
 * name : usersController.js
 * author : Aman
 * created-date : 20-May-2020
 * Description : Users related information.
 */

 // Dependencies 

 const usersHelper = require(MODULES_BASE_PATH + "/users/helper");

 /**
    * Users
    * @class
*/
module.exports = class Users {
    constructor() {}

    static get name() {
        return "users";
    }

    /**
    * @api {get} /assessment/api/v1/users/programs/:userId List of user programs
    * @apiVersion 1.0.0
    * @apiName List of user programs
    * @apiGroup Users
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/users/programs/e97b5582-471c-4649-8401-3cc4249359bb
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    *  {
    "message": "Successfully fetched user programs",
    "status": 200,
    "result": [{
         "_id": "5b98d7b6d4f87f317ff615ee",
         "name": "DCPCR School Development Index 2018-19",
         "description": "DCPCR School Development Index 2018-19",
         "externalId": "PROGID01",
         "startDate": "2018-05-20T05:39:26.970Z",
         "endDate": "2020-05-20T05:39:26.970Z",
         "solutions": [{
              "_id": "5b98fa069f664f7e1ae7498c",
              "externalId": "EF-DCPCR-2018-001",
              "name": "DCPCR Assessment Framework 2018",
              "description": "DCPCR Assessment Framework 2018",
              "type": "assessment",
              "subType": "institutional",
              "programId": "5b98d7b6d4f87f317ff615ee",
              "programExternalId": "PROGID01",
              "programName": "DCPCR School Development Index 2018-19",
              "entities": [
                        {
                            "_id": "5bfe53ea1d0c350d61b78d3d",
                            "externalId": "1412153",
                            "name": "Nav Jyoti Public School, Karam Vihar Hari Enclave Sultan Puri Delhi",
                            "city": "Urban",
                            "state": "Delhi",
                            "submissionId": "5d316799dc83304d4cfdac0e",
                            "submissionStatus": "completed"
                }]
          }]
    }]
  */

    /**
   * Programs list information 
   * @method
   * @name programs
   * @returns {JSON} list of programs information. 
   */
  
   programs(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let userPrograms = await usersHelper.programs(
            req.params._id ? req.params._id : req.userDetails.userId
        );

        return resolve(userPrograms);

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error
        })

      }


    })
  }


    /**
    * @api {get} /assessment/api/v1/users/entities/:userId List of user entities
    * @apiVersion 1.0.0
    * @apiName List of user entities
    * @apiGroup Users
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/users/entities/e97b5582-471c-4649-8401-3cc4249359bb
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    *  {
    "message": "Successfully fetched user entities",
    "status": 200,
    "result": {
        "entityTypes": [
            {
                "name": "School",
                "key": "school"
            }
        ],
        "entities": {
            "school": [
                {
                    "entityId": "5bfe53ea1d0c350d61b78d0a",
                    "entityName": "Sachdeva Convent School, Street No.-5 Sangam Vihar (Wazirabad - Jagatpur Road), Delhi",
                    "externalId": "1207229",
                    "solutions": [
                        {
                            "programName": "DCPCR School Development Index 2018-19",
                            "type": "assessment",
                            "subType": "institutional",
                            "description": "DCPCR Assessment Framework 2018",
                            "externalId": "EF-DCPCR-2018-001",
                            "submissionId": "",
                            "submissionStatus": "pending"
                        }
                    ]
                },
                {
                    "entityId": "5cee7d1390013936552f6a8d",
                    "entityName": "GCHS Baragur",
                    "externalId": "KFVOO1",
                    "solutions": [
                        {
                            "programName": "DCPCR School Development Index 2018-19",
                            "type": "observation",
                            "subType": "school",
                            "description": "Test-observations",
                            "externalId": "Test-observations",
                            "submissions": [
                                {
                                    "_id": "5e8dacb780073d7d548cd6c1",
                                    "entityId": "5cee7d1390013936552f6a8d",
                                    "status": "started",
                                    "submissionNumber": 1
                                }
                            ],
                            "totalSubmissionCount": 5
                        }
                    ]
                }
            ]
        }
    }
}
  */

    /**
   * List of user entities.
   * @method
   * @name entities
   * @returns {JSON} List of user entities.  
   */
  
  entities(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let entitiesData = await usersHelper.entities(
            req.params._id ? req.params._id : req.userDetails.userId
        );

        return resolve(entitiesData);

      } catch (error) {

        return reject({
          status: error.status || httpStatusCode.internal_server_error.status,
          message: error.message || httpStatusCode.internal_server_error.message,
          errorObject: error
        })

      }


    })
  }
}