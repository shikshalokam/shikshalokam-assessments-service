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
    * "message": "Successfully fetched user programs",
    * {
    "status": 200,
    "result": [
        {
            "_id": "5b98d7b6d4f87f317ff615ee",
            "name": "DCPCR School Development Index 2018-19",
            "externalId": "PROGID01",
            "description": "DCPCR School Development Index 2018-19",
            "solutions": [
                {
                    "programName": "DCPCR School Development Index 2018-19",
                    "programId": "5b98d7b6d4f87f317ff615ee",
                    "_id": "5b98fa069f664f7e1ae7498c",
                    "name": "DCPCR Assessment Framework 2018",
                    "externalId": "EF-DCPCR-2018-001",
                    "description": "DCPCR Assessment Framework 2018",
                    "type": "assessment",
                    "subType": "institutional",
                    "entities": [
                        {
                            "_id": "5bfe53ea1d0c350d61b78d5c",
                            "name": "Tulip Public School, Pckt 20 Sec.24 Rohini, Delhi",
                            "externalId": "1413311",
                            "entityType": "school",
                            "submissionId": "5e9537f7cd48090a5339a640",
                            "submissionStatus": "inprogress"
                        },
                        {
                            "_id": "5d80ee3bbbcc4b1bf8e79ddf",
                            "name": "PUNJAB GSSS K.B.D.S. BOYS",
                            "externalId": "3020800103",
                            "entityType": "school",
                            "totalSubmissionCount": 1,
                            "submissions": [
                                {
                                    "submissionId": "5ebb6df88ea4e621b754c86c",
                                    "submissionStatus": "completed",
                                    "submissionNumber": 1,
                                    "entityId": "5d80ee3bbbcc4b1bf8e79ddf",
                                    "createdAt": "2020-05-13T03:48:08.380Z",
                                    "updatedAt": "2020-05-13T03:48:36.665Z",
                                    "observationName": "PACE AP MEO d-1",
                                    "observationId": "5ea1a24369ce5e39c315268b"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
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
    * {
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
                    "_id": "5bfe53ea1d0c350d61b78d5c",
                    "name": "Tulip Public School, Pckt 20 Sec.24 Rohini, Delhi",
                    "externalId": "1413311",
                    "entityType": "school",
                    "solutions": [
                        {
                            "programName": "DCPCR School Development Index 2018-19",
                            "programId": "5b98d7b6d4f87f317ff615ee",
                            "_id": "5b98fa069f664f7e1ae7498c",
                            "name": "DCPCR Assessment Framework 2018",
                            "externalId": "EF-DCPCR-2018-001",
                            "description": "DCPCR Assessment Framework 2018",
                            "type": "assessment",
                            "subType": "institutional",
                            "submissionId": "5e9537f7cd48090a5339a640",
                            "submissionStatus": "inprogress"
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

  /**
     * @api {get} /assessment/api/v1/users/privatePrograms/:userId List of user private programs
     * @apiVersion 2.0.0
     * @apiName List of user private programs
     * @apiGroup Programs
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/users/privatePrograms/e97b5582-471c-4649-8401-3cc4249359bb
     * @apiParamExample {json} Response:
     * {
     "message": "List of private programs",
     "status": 200,
     "result": [
        {
            "_id": "5edf0d14c57dab7f639f3e0d",
            "externalId": "EF-DCPCR-2018-001-TEMPLATE-2020-06-09 09:46:20",
            "name": "My program",
            "description": "DCPCR Assessment Framework 2018"
        }
     ]}
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * Private Programs .
    * @method
    * @name privatePrograms
    * @param {Object} req -request Data.
    * @returns {JSON} - List of programs created by user.
    */

   async privatePrograms(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let programsData = 
            await usersHelper.privatePrograms(
                (req.params._id && req.params._id != "") ? 
                req.params._id : 
                req.userDetails.userId
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