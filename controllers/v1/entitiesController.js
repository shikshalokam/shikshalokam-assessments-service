/**
 * name : entitiesController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : All Entities related information.
 */

// Dependencies
const csv = require("csvtojson");
const entitiesHelper = require(MODULES_BASE_PATH + "/entities/helper");
const FileStream = require(ROOT_PATH + "/generics/fileStream");

 /**
    * Entities
    * @class
*/
module.exports = class Entities extends Abstract {
  constructor() {
    super(entitiesSchema);
  }

  static get name() {
    return "entities";
  }

  /**
  * @api {post} /assessment/api/v1/entities/add?type=:entityType&programId=:programInternalId&solutionId=:solutionInternalId&parentEntityId=:parentEntityInternalId Entity add
  * @apiVersion 1.0.0
  * @apiName Entity add
  * @apiGroup Entities
  * @apiParamExample {json} Request-Body:
  * {
  "data" :[
	 	{
    "externalId" : "Test",
    "addressLine1" : "A1",
    "addressLine2" : "A2",
    "city" : "Bangalore",
    "country" : "India",
    "gpsLocation" : "",
    "name" : "Test School",
    "phone" : "761957452",
    "principalName" : "P1",
    "state" : "Karnataka",
    "pincode" : "7678",
    "districtId" : "10",
    "districtName" : "North",
    "zoneId" : "1",
    "administration" : "DOE",
    "gender" : "Co-ed",
    "shift" : "Morning",
    "totalStudents" : "1000",
    "totalBoys" : "500",
    "totalGirls" : "500",
    "lowestGrade" : "1",
    "highestGrade" : "12",
    "status" : "active",
    "updatedDate" : "Wed Sep 12 2018 14:26:01 GMT+0530",
    "createdDate" : "Wed Sep 12 2018 14:26:01 GMT+0530",
    "blockId" : "1",
    "questionGroup" : [ 
        "A1", 
        "A2", 
        "A3"
    ],
    "types" : [ 
        "A1", 
        "A2", 
        "A3"
    ]}
	 	]
  *}
  * @apiUse successBody
  * @apiUse errorBody
  * @apiSampleRequest /assessment/api/v1/entities/add?type=school&programId=5b98d7b6d4f87f317ff615ee&solutionId=5b98fa069f664f7e1ae7498c
  * @apiParamExample {json} Response:
  * "result": [
        {
            "_id": "5d8f36c430c4af40b646c4bc",
            "deleted": false,
            "entityTypeId": "5ce23d633c330302e720e65f",
            "entityType": "school",
            "metaInformation": {
                "externalId": "Test",
                "addressLine1": "A1",
                "addressLine2": "A2",
                "city": "Bangalore",
                "country": "India",
                "gpsLocation": "",
                "name": "Test School",
                "phone": "761957452",
                "principalName": "P1",
                "state": "Karnataka",
                "pincode": "7678",
                "districtId": "10",
                "districtName": "North",
                "zoneId": "1",
                "administration": "DOE",
                "gender": "Co-ed",
                "shift": "Morning",
                "totalStudents": "1000",
                "totalBoys": "500",
                "totalGirls": "500",
                "lowestGrade": "1",
                "highestGrade": "12",
                "status": "active",
                "updatedDate": "Wed Sep 12 2018 14:26:01 GMT+0530",
                "createdDate": "Wed Sep 12 2018 14:26:01 GMT+0530",
                "blockId": "1",
                "questionGroup": [
                    "A1",
                    "A2",
                    "A3"
                ],
                "types": [
                    "A1",
                    "A2",
                    "A3"
                ],
                "createdByProgramId": "5d8f36c430c4af40b646c4ba",
                "createdBySolutionId": "5d8f36c430c4af40b646c4bb"
            },
            "updatedBy": "e97b5582-471c-4649-8401-3cc4249359bb",
            "createdBy": "e97b5582-471c-4649-8401-3cc4249359bb",
            "updatedAt": "2019-09-28T10:32:36.318Z",
            "createdAt": "2019-09-28T10:32:36.318Z",
            "__v": 0
        }
    ]
  */
  
  /**
   * Add entities.
   * @method
   * @name add
   * @param {Object} req - All requested Data.
   * @param {Object} req.files - requested files.
   * @returns {JSON} - Added entities information.
   */

  add(req) {
    return new Promise(async (resolve, reject) => {

      try {
        let queryParams = {
          type: req.query.type,
          programId: req.query.programId,
          solutionId: req.query.solutionId,
          parentEntityId: req.query.parentEntityId
        };
        let result = await entitiesHelper.add(queryParams, req.body.data, req.userDetails);

        return resolve({
          message: messageConstants.apiResponses.ENTITY_ADDED,
          result: result
        });

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
  * @api {get} /assessment/api/v1/entities/list/:entityId?type=:entityType Entity list
  * @apiVersion 1.0.0
  * @apiName Entity list
  * @apiGroup Entities
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/entities/list/5bfe53ea1d0c350d61b78d0a?type=parent
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * List entities.
   * @method
   * @name list
   * @param {Object} req - requested entity information.
   * @param {String} req.query.type - type of entity requested.
   * @param {String} req.params._id - requested entity id. 
   * @param {Number} req.pageSize - total size of the page.
   * @returns {JSON} - Listed entity details.
   */

  list(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await entitiesHelper.list(req.query.type, req.params._id, req.pageSize, req.pageSize * (req.pageNo - 1));

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_FETCHED,
          result: result.entityData,
          count: result.count
        });

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
  * @api {get} /assessment/api/v1/entities/form?type=:entityType Entity form
  * @apiVersion 1.0.0
  * @apiName Entity form
  * @apiGroup Entities
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/entities/form?type=parent
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * Entities form.
   * @method
   * @name form
   * @param {Object} req - requested entity information.
   * @param {String} req.query.type - type of entity requested.
   * @returns {JSON} - Listed entity details.
   */

  form(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await entitiesHelper.form(req.query.type);

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_FETCHED,
          result: result
        });

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
  * @api {get} /assessment/api/v1/entities/fetch/:entityId?type=:entityType Entity profile
  * @apiVersion 1.0.0
  * @apiName Entity profile
  * @apiGroup Entities
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /assessment/api/v1/entities/fetch/5bfe53ea1d0c350d61b78d0a?type=parent
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Fetch entity details.
   * @method
   * @name fetch
   * @param {Object} req - requested entity data.
   * @param {String} req.query.type - entity type.
   * @param {String} req.params._id - entity id.   
   * @returns {JSON} - fetch entity details.
   */

  fetch(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await entitiesHelper.fetch(req.query.type, req.params._id);

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_FETCHED,
          result: result
        });

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
  * @api {post} /assessment/api/v1/entities/update/:entityId?type=:entityType Update Entity Information
  * @apiVersion 1.0.0
  * @apiName Update Entity Information
  * @apiGroup Entities
  * @apiParamExample {json} Request-Body:
  * 	{
  *	        "studentName" : "",
  *	        "grade" : "",
  *	        "name" : "",
  *	        "gender" : "",
  *   		  "type": "",
  *  		    "typeLabel":"",
  *  		    "phone1": "",
  *  	    	"phone2": "",
  *     		"address": "",
  *    		  "programId": "",
  *    		  "callResponse":"",
  *         "createdByProgramId" : "5b98d7b6d4f87f317ff615ee",
  *         "parentEntityId" : "5bfe53ea1d0c350d61b78d0a"
  *   }
  * @apiUse successBody
  * @apiUse errorBody
  */

  /**
   * Update entity information.
   * @method
   * @name update
   * @param {Object} req - requested entity data.
   * @param {String} req.query.type - entity type.
   * @param {String} req.params._id - entity id.
   * @param {Object} req.body - entity information that need to be updated.       
   * @returns {JSON} - Updated entity information.
   */

  update(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = await entitiesHelper.update(req.query.type, req.params._id, req.body);

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_UPDATE,
          result: result
        });

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
  * @api {post} /assessment/api/v1/entities/bulkCreate?type=:entityType Bulk Create Entities CSV
  * @apiVersion 1.0.0
  * @apiName Bulk Create Entities CSV
  * @apiGroup Entities
  * @apiParam {String} type Entity Type.
  * @apiParam {File} entities Mandatory entities file of type CSV.
  * @apiUse successBody
  * @apiUse errorBody
  */

     /**
   * Bulk create entities.
   * @method
   * @name bulkCreate
   * @param {Object} req - requested data.
   * @param {String} req.query.type - requested entity type.
   * @param {Object} req.userDetails - logged in user details.
   * @param {Object} req.files.entities - entities data.         
   * @returns {CSV} - A CSV with name Entity-Upload is saved inside the folder
   * public/reports/currentDate
   */

  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let entityCSVData = await csv().fromString(req.files.entities.data.toString());
        let newEntityData = await entitiesHelper.bulkCreate(req.query.type, null, null, req.userDetails, entityCSVData);

        if (newEntityData.length > 0) {

          const fileName = `Entity-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newEntityData.map(async newEntity => {
            input.push(newEntity);
          }))

          input.push(null);

        } else {
          throw messageConstants.apiResponses.SOMETHING_WENT_WRONG;
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


  /**
  * @api {post} /assessment/api/v1/entities/bulkUpdate Bulk Update Entities CSV
  * @apiVersion 1.0.0
  * @apiName Bulk Update Entities CSV
  * @apiGroup Entities
  * @apiParam {File} entities Mandatory entities file of type CSV.
  * @apiUse successBody
  * @apiUse errorBody
  */

     /**
   * Bulk update entities.
   * @method
   * @name bulkUpdate
   * @param {Object} req - requested data.
   * @param {Object} req.userDetails - logged in user details.
   * @param {Object} req.files.entities - entities data.         
   * @returns {CSV} - A CSV with name Entity-Upload is saved inside the folder
   * public/reports/currentDate
   */

  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let entityCSVData = await csv().fromString(req.files.entities.data.toString());
        
        let newEntityData = await entitiesHelper.bulkUpdate(req.userDetails, entityCSVData);

        if (newEntityData.length > 0) {

          const fileName = `Entity-Upload`;
          let fileStream = new FileStream(fileName);
          let input = fileStream.initStream();

          (async function () {
            await fileStream.getProcessorPromise();
            return resolve({
              isResponseAStream: true,
              fileNameWithPath: fileStream.fileNameWithPath()
            });
          }());

          await Promise.all(newEntityData.map(async newEntity => {
            input.push(newEntity);
          }))

          input.push(null);

        } else {
          throw new Error(messageConstants.apiResponses.SOMETHING_WENT_WRONG);
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

  /**
  * @api {post} /assessment/api/v1/entities/mappingUpload?programId=:programExternalId&?solutionId=:solutionExternalId Upload Entity Mapping Information CSV
  * @apiVersion 1.0.0
  * @apiName Upload Entity Information CSV
  * @apiGroup Entities
  * @apiParam {String} programId Program External ID.
  * @apiParam {String} solutionId Solution External ID.
  * @apiParam {File} entityMap Mandatory entity mapping file of type CSV.
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * Map parent entity to child entity.
   * @method
   * @name mappingUpload
   * @param {Object} req - requested data.
   * @param {Array} req.files.entityMap - Array of entityMap data.         
   * @returns {JSON} - Message of successfully updated.
   */

  mappingUpload(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let entityCSVData = await csv().fromString(req.files.entityMap.data.toString());

        let entityMappingUploadResponse = await entitiesHelper.processEntityMappingUploadData(entityCSVData);
        if(!entityMappingUploadResponse.success) {
          throw new Error (messageConstants.apiResponses.SOMETHING_WENT_WRONG);
        }

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_UPDATE
        });

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
  * @api {post} /assessment/api/v1/entities/uploadForPortal?type=:entityType&programId=:programExternalId&solutionId=:solutionExternalId Upload Entity Information CSV Using Portal
  * @apiVersion 1.0.0
  * @apiName Upload Entity Information CSV Using Portal
  * @apiGroup Entities
  * @apiParam {File} entities Mandatory entities file of type CSV.
  * @apiUse successBody
  * @apiUse errorBody
  */

    /**
   * upload entities for portal.
   * @method
   * @name uploadForPortal
   * @param {Object} req - requested data.
   * @param {Array} req.files.entities - Array of entities data.         
   * @returns {JSON} - Message of successfully updated.
   */

  uploadForPortal(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let entityCsvData = await csv().fromString(req.files.entities.data.toString());

        await entitiesHelper.bulkCreate(req.query.type, req.query.programId, req.query.solutionId, req.userDetails, entityCsvData);

        return resolve({
          message: messageConstants.apiResponses.ENTITY_INFORMATION_UPDATE
        });

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
  * @api {get} /assessment/api/v1/entities/relatedEntities/:entityId Get Related Entities
  * @apiVersion 1.0.0
  * @apiName Get Related Entities
  * @apiGroup Entities
  * @apiSampleRequest /assessment/api/v1/entities/relatedEntities/5c0bbab881bdbe330655da7f
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
     "relatedEntities": [
            {
                "_id": "5d6609ef81a57a6173a79e78",
                "entityTypeId": "5d6605db652f3110440de195",
                "entityType": "state",
                "metaInformation": {
                    "externalId": "DL",
                    "name": "Delhi"
                }
            },
            {
                "_id": "5d660a3d81a57a6173a79e7b",
                "entityTypeId": "5ce23d633c330302e720e665",
                "entityType": "district",
                "metaInformation": {
                    "externalId": "1",
                    "name": "North"
                }
            },
            {
                "_id": "5d660a5681a57a6173a79e7f",
                "entityTypeId": "5d6606ce652f3110440de21b",
                "entityType": "zone",
                "metaInformation": {
                    "externalId": "1",
                    "name": "Zone 1"
                }
            }
        ]
  */

    /**
   * Related entities of the given entity.
   * @method
   * @name relatedEntities
   * @param {Object} req - requested data.
   * @param {String} req.params._id - requested entity id.         
   * @returns {JSON} - Message of successfully updated.
   */

  relatedEntities(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = {}
        let projection = ["metaInformation.externalId", "metaInformation.name", "metaInformation.addressLine1", "metaInformation.addressLine2", "metaInformation.administration", "metaInformation.city", "metaInformation.country", "entityTypeId", "entityType"];
        let entityDocument = await entitiesHelper.entityDocuments({ _id: req.params._id }, projection);

        if (entityDocument.length < 1) {
          throw { 
            status: httpStatusCode.not_found.status, 
            message: messageConstants.apiResponses.ENTITY_NOT_FOUND 
          };
        }

        let relatedEntities = await entitiesHelper.relatedEntities(entityDocument[0]._id, entityDocument[0].entityTypeId, entityDocument[0].entityType, projection);

        _.merge(result, entityDocument[0])
        result["relatedEntities"] = (relatedEntities.length > 0) ? relatedEntities : [];

        return resolve({
          message: messageConstants.apiResponses.ENTITY_FETCHED,
          result: result
        });

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
  * @api {get} /assessment/api/v1/entities/listByEntityType/:entityType 
  * Get all the entities in the particular entity types.
  * @apiVersion 1.0.0
  * @apiName Get Related Entities
  * @apiGroup Entities
  * @apiSampleRequest /assessment/api/v1/entities/listByEntityType/state
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  * {
    "message": "Entities fetched successfull",
    "status": 200,
    "result": [
      {
        "externalId": "1",
        "name": "North",
        "_id": "5d660a3d81a57a6173a79e7b"
      }
    ]
  }
  */

    /**
   * List of entities by entityType.
   * @method
   * @name listByEntityType
   * @param {Object} req - requested data.
   * @param {String} req.params._id - requested entity type.         
   * @returns {JSON} - Array of entities.
   */

  listByEntityType(req) {
    return new Promise(async (resolve, reject) => {

      try {
        
        let schemaMetaInformation = 
        entitiesHelper.entitiesSchemaData().SCHEMA_METAINFORMATION;

        let projection = [
          schemaMetaInformation+".externalId",
          schemaMetaInformation+".name"
        ];
        
        let skippingValue = req.pageSize * (req.pageNo - 1);

        let entityDocuments =  await entitiesHelper.entityDocuments({ 
          entityType : req.params._id
        }, 
        projection,
        req.pageSize, 
        skippingValue,
        {
          [schemaMetaInformation+".name"] : 1
        }
        );

        if ( entityDocuments.length < 0 ) {
          throw { 
            status: httpStatusCode.not_found.status, 
            message: messageConstants.apiResponses.ENTITY_NOT_FOUND
          };
        }

        entityDocuments = entityDocuments.map(entityDocument =>{
          return {
            externalId : entityDocument.metaInformation.externalId,
            name : entityDocument.metaInformation.name,
            _id : entityDocument._id
          }
        })

        return resolve({
          message: messageConstants.apiResponses.ENTITY_FETCHED,
          result: entityDocuments
        });

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
