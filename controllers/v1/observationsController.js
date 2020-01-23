/**
 * name : observationsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : Observations information.
 */

// Dependencies

const observationsHelper = require(MODULES_BASE_PATH + "/observations/helper")
const entitiesHelper = require(MODULES_BASE_PATH + "/entities/helper")
const assessmentsHelper = require(MODULES_BASE_PATH + "/assessments/helper")
const solutionsHelper = require(MODULES_BASE_PATH + "/solutions/helper")
const csv = require("csvtojson");
const FileStream = require(ROOT_PATH + "/generics/fileStream");
const assessorsHelper = require(MODULES_BASE_PATH + "/entityAssessors/helper")

/**
    * Observations
    * @class
*/
module.exports = class Observations extends Abstract {

    constructor() {
        super(observationsSchema);
    }

    /**
    * @api {get} /assessment/api/v1/observations/solutions/:entityTypeId?search=:searchText&limit=1&page=1 Observation Solution
    * @apiVersion 1.0.0
    * @apiName Observation Solution
    * @apiGroup Observations
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/observations/solutions/5cd955487e100b4dded3ebb3?search=Framework&pageSize=10&pageNo=1
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * "result": [
        {
            "data": [
                {
                    "_id": "5c6bd309af0065f0e0d4223b",
                    "externalId": "TAF-2019",
                    "name": "Teacher Assessment Framework",
                    "description": "Teacher Assessment Framework",
                    "keywords": [
                        "Framework",
                        "Priyanka",
                        "Assessment"
                    ],
                    "entityTypeId": "5ce23d633c330302e720e661",
                    "programId": "5c6bd365af0065f0e0d42280"
                }
            ],
            "count": 1
        }
    ]
    */

     /**
   * Observation solutions.
   * @method
   * @name solutions
   * @param {Object} req -request Data.
   * @param {String} req.params._id - entity type id.
   * @returns {JSON} - Solution Details.
   */

    async solutions(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let response = {};
                let messageData;
                let matchQuery = {};

                matchQuery["$match"] = {};

                if (req.params._id) {
                    matchQuery["$match"]["entityTypeId"] = ObjectId(req.params._id);
                }

                matchQuery["$match"]["type"] = "observation";
                matchQuery["$match"]["isReusable"] = true;
                matchQuery["$match"]["status"] = "active";

                matchQuery["$match"]["$or"] = [];
                matchQuery["$match"]["$or"].push({ "name": new RegExp(req.searchText, 'i') }, { "description": new RegExp(req.searchText, 'i') }, { "keywords": new RegExp(req.searchText, 'i') });

                let solutionDocument = await solutionsHelper.search(matchQuery, req.pageSize, req.pageNo);


                messageData = messageConstants.apiResponses.SOLUTION_FETCHED;

                if (!solutionDocument[0].count) {
                    solutionDocument[0].count = 0;
                    messageData = messageConstants.apiResponses.SOLUTION_NOT_FOUND;
                }

                response.result = solutionDocument;
                response["message"] = messageData;

                return resolve(response);

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
    * @api {get} /assessment/api/v1/observations/metaForm/:solutionId Observation Creation Meta Form
    * @apiVersion 1.0.0
    * @apiName Observation Creation Meta Form
    * @apiGroup Observations
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/observations/metaForm
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * "result": [
        {
            "field": "name",
            "label": "Title",
            "value": "",
            "visible": true,
            "editable": true,
            "validation": {
                "required": true
            },
            "input": "text"
        }
    ]
    */

     /**
   * Observation meta form.
   * @method
   * @name metaForm
   * @param {Object} req -request Data.
   * @returns {JSON} - Observation meta form.
   */

    async metaForm(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let solutionsData = await database.models.solutions.findOne({
                    _id: ObjectId(req.params._id),
                    isReusable: true
                }, {
                        observationMetaFormKey: 1
                    }).lean();


                if (!solutionsData._id) {
                    let responseMessage = httpStatusCode.bad_request.message;
                    return resolve({ 
                        status: httpStatusCode.bad_request.status, 
                        message: responseMessage 
                    });
                }

                let observationsMetaForm = await database.models.forms.findOne({ "name": (solutionsData.observationMetaFormKey && solutionsData.observationMetaFormKey != "") ? solutionsData.observationMetaFormKey : "defaultObservationMetaForm" }, { value: 1 }).lean();

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_META_FETCHED,
                    result: observationsMetaForm.value
                });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }


    /**
     * @api {post} /assessment/api/v1/observations/create?solutionId=:solutionInternalId Create Observation
     * @apiVersion 1.0.0
     * @apiName Create Observation
     * @apiGroup Observations
     * @apiParamExample {json} Request-Body:
     * {
     *	    "data": {
     *          "name": String,
     *          "description": String,
     *          "startDate": String,
     *          "endDate": String,
     *          "status": String,
     *          "entities":["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
     *      }
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Observation.
    * @method
    * @name create
    * @param {Object} req -request Data.
    * @returns {JSON} - Created observation data.
    */

    create(req) {
        return new Promise(async (resolve, reject) => {

            try {

                let result = await observationsHelper.create(req.query.solutionId, req.body.data, req.userDetails);

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_CREATED,
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
     * @api {get} /assessment/api/v1/observations/list Observations list
     * @apiVersion 1.0.0
     * @apiName Observations list
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/list
     * @apiParamExample {json} Response:
        "result": [
            {
                "_id": "5d09c34d1f7fd5a2391f7251",
                "entities": [],
                "name": "Observation 1",
                "description": "Observation Description",
                "status": "published",
                "solutionId": "5b98fa069f664f7e1ae7498c"
            },
            {
                "_id": "5d1070326f6ed50bc34aec2c",
                "entities": [
                    {
                        "_id": "5cebbefe5943912f56cf8e16",
                        "submissionStatus": "pending",
                        "submissions": [],
                        "name": "asd"
                    },
                    {
                        "_id": "5cebbf275943912f56cf8e18",
                        "submissionStatus": "pending",
                        "submissions": [],
                        "name": "asd"
                    }
                ],
                "status": "published",
                "endDate": "2019-06-24T00:00:00.000Z",
                "name": "asdasd",
                "description": "asdasdasd",
                "solutionId": "5c6bd309af0065f0e0d4223b"
            }
        ]
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * List Observation.
    * @method
    * @name list
    * @param {Object} req -request Data.
    * @returns {JSON} - List observation data.
    */

    async list(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let observations = new Array;

                observations = await observationsHelper.list(req.userDetails.userId);
                
                let responseMessage = messageConstants.apiResponses.OBSERVATION_LIST;

                return resolve({
                    message: responseMessage,
                    result: observations
                });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
     * @api {post} /assessment/api/v1/observations/addEntityToObservation/:observationId Map entities to observations
     * @apiVersion 1.0.0
     * @apiName Map entities to observations
     * @apiGroup Observations
     * @apiParamExample {json} Request-Body:
     * {
     *	    "data": ["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * Add entity to observation.
    * @method
    * @name addEntityToObservation
    * @param {Object} req -request Data.
    * @param {String} req.params._id -Observation id. 
    * @returns {JSON} message - regarding either entity is added to observation or not.
    */

    async addEntityToObservation(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let responseMessage = "Updated successfully.";

                let observationDocument = await database.models.observations.findOne(
                    {
                        _id: req.params._id,
                        createdBy: req.userDetails.userId,
                        status: { $ne: "inactive" }
                    },
                    {
                        entityTypeId: 1,
                        status: 1
                    }
                ).lean();

                if (observationDocument.status != "published") {
                    return resolve({
                        status: httpStatusCode.bad_request.status,
                        message: messageConstants.apiResponses.OBSERVATION_ALREADY_COMPLETED +
                        messageConstants.apiResponses.OBSERVATION_NOT_PUBLISHED
                    });
                }

                let entitiesToAdd = await entitiesHelper.validateEntities(req.body.data, observationDocument.entityTypeId);

                if (entitiesToAdd.entityIds.length > 0) {
                    await database.models.observations.updateOne(
                        {
                            _id: observationDocument._id
                        },
                        {
                            $addToSet: { entities: entitiesToAdd.entityIds }
                        }
                    );
                }


                if (entitiesToAdd.entityIds.length != req.body.data.length) {
                    responseMessage = messageConstants.apiResponses.ENTITIES_NOT_UPDATE;
                }

                return resolve({
                    message: responseMessage
                });


            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
     * @api {post} /assessment/api/v1/observations/removeEntityFromObservation/:observationId Un Map entities to observations
     * @apiVersion 1.0.0
     * @apiName Un Map entities to observations
     * @apiGroup Observations
    * @apiParamExample {json} Request-Body:
     * {
     *	    "data": ["5beaa888af0065f0e0a10515","5beaa888af0065f0e0a10516"]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */


    /**
    * Remove entity from observation.
    * @method
    * @name removeEntityFromObservation
    * @param {Object} req -request Data.
    * @param {String} req.params._id -observation id. 
    * @returns {JSON} observation remoevable message
    */

    async removeEntityFromObservation(req) {

        return new Promise(async (resolve, reject) => {

            try {

                await database.models.observations.updateOne(
                    {
                        _id: ObjectId(req.params._id),
                        status: { $ne: "completed" },
                        createdBy: req.userDetails.id
                    },
                    {
                        $pull: {
                            entities: { $in: gen.utils.arrayIdsTobjectIds(req.body.data) }
                        }
                    }
                );

                return resolve({
                    message: messageConstants.apiResponses.ENTITY_REMOVED
                })


            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
     * @api {get} /assessment/api/v1/observations/searchEntities/:observationId?search=:searchText&&limit=1&&page=1 Search Entities
     * @apiVersion 1.0.0
     * @apiName Search Entities
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/search/:observationId
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
        {
            "message": "Entities fetched successfully",
            "status": 200,
            "result": [
                {
                    "data": [
                        {
                            "_id": "5c5b1581e7e84d1d1be9175f",
                            "name": "Vijaya krishna.T",
                            "selected": false
                        }
                    ],
                    "count": 435
                }
            ]
        }
     */


    /**
    * Search entities in observation.
    * @method
    * @name searchEntities
    * @param {Object} req -request Data.
    * @param {String} req.params._id -observation id. 
    * @returns {JSON} List of entities in observations.
    */

    async searchEntities(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let response = {
                    result: {}
                };


                let observationDocument = await database.models.observations.findOne(
                    {
                        _id: req.params._id,
                        createdBy: req.userDetails.userId,
                        status: { $ne: "inactive" }
                    },
                    {
                        entityTypeId: 1,
                        entities: 1
                    }
                ).lean();

                if (!observationDocument) {
                    throw { 
                        status: httpStatusCode.bad_request.status, 
                        message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND 
                    }
                }

                let entityDocuments = await entitiesHelper.search(observationDocument.entityTypeId, req.searchText, req.pageSize, req.pageNo);

                let observationEntityIds = observationDocument.entities.map(entity => entity.toString());

                entityDocuments[0].data.forEach(eachMetaData => {
                    eachMetaData.selected = (observationEntityIds.includes(eachMetaData._id.toString())) ? true : false;
                })

                let messageData = messageConstants.apiResponses.ENTITY_FETCHED;
                if (!entityDocuments[0].count) {
                    entityDocuments[0].count = 0;
                    messageData = messageConstants.apiResponses.ENTITY_NOT_FOUND;
                }
                response.result = entityDocuments;
                response["message"] = messageData;

                return resolve(response);


            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }


    /**
     * @api {get} /assessment/api/v1/observations/assessment/:observationId?entityId=:entityId&submissionNumber=submissionNumber Assessments
     * @apiVersion 1.0.0
     * @apiName Assessments
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParam {String} entityId Entity ID.
     * @apiParam {Int} submissionNumber Submission Number.
     * @apiSampleRequest /assessment/api/v1/observations/assessment/5d286eace3cee10152de9efa?entityId=5d286b05eb569501488516c4&submissionNumber=1
     * @apiUse successBody
     * @apiUse errorBody
     */

     /**
    * Assessment for observation.
    * @method
    * @name assessment
    * @param {Object} req -request Data.
    * @param {String} req.params._id -observation id. 
    * @param {String} req.query.entityId - entity id.
    * @param {String} req.query.submissionNumber - submission number 
    * @returns {JSON} - Observation Assessment details.
    */

    async assessment(req) {

        return new Promise(async (resolve, reject) => {

            try {

                let response = {
                    message : messageConstants.apiResponses.ASSESSMENT_FETCHED,
                    result : {}
                };

                let observationDocument = await database.models.observations.findOne({ _id: req.params._id, createdBy: req.userDetails.userId, status: { $ne: "inactive" }, entities: ObjectId(req.query.entityId) }).lean();

                if (!observationDocument) {
                    return resolve({ 
                        status: httpStatusCode.bad_request.status, 
                        message: messageConstants.apiResponses.OBSERVATION_NOT_FOUND 
                    });
                }


                let entityQueryObject = { _id: req.query.entityId, entityType: observationDocument.entityType };
                let entityDocument = await database.models.entities.findOne(
                    entityQueryObject,
                    {
                        metaInformation: 1,
                        entityTypeId: 1,
                        entityType: 1
                    }
                ).lean();

                if (!entityDocument) {
                    let responseMessage = messageConstants.apiResponses.ENTITY_NOT_FOUND;
                    return resolve({ 
                        status: httpStatusCode.bad_request.status, 
                        message: responseMessage 
                    });
                }

                const submissionNumber = req.query.submissionNumber && req.query.submissionNumber > 1 ? parseInt(req.query.submissionNumber) : 1;

                let solutionQueryObject = {
                    _id: observationDocument.solutionId,
                    status: "active",
                };

                let solutionDocumentProjectionFields = await observationsHelper.solutionDocumentProjectionFieldsForDetailsAPI()

                let solutionDocument = await database.models.solutions.findOne(
                    solutionQueryObject,
                    solutionDocumentProjectionFields
                ).lean();

                if (!solutionDocument) {
                    let responseMessage = messageConstants.apiResponses.SOLUTION_NOT_FOUND;
                    return resolve({ 
                        status:  httpStatusCode.bad_request.status, 
                        message: responseMessage 
                    });
                }

                let currentUserAssessmentRole = await assessmentsHelper.getUserRole(req.userDetails.allRoles);
                let profileFieldAccessibility = (solutionDocument.roles && solutionDocument.roles[currentUserAssessmentRole] && solutionDocument.roles[currentUserAssessmentRole].acl && solutionDocument.roles[currentUserAssessmentRole].acl.entityProfile) ? solutionDocument.roles[currentUserAssessmentRole].acl.entityProfile : "";

                let entityProfileForm = await database.models.entityTypes.findOne(
                    solutionDocument.entityTypeId,
                    {
                        profileForm: 1
                    }
                ).lean();

                if (!entityProfileForm) {
                    let responseMessage = messageConstants.apiResponses.ENTITY_PROFILE_FORM_NOT_FOUND;
                    return resolve({ 
                        status: httpStatusCode.bad_request.status, 
                        message: responseMessage 
                    });
                }

                let form = [];
                let entityDocumentTypes = (entityDocument.metaInformation.types) ? entityDocument.metaInformation.types : ["A1"];
                let entityDocumentQuestionGroup = (entityDocument.metaInformation.questionGroup) ? entityDocument.metaInformation.questionGroup : ["A1"];
                let entityProfileFieldsPerEntityTypes = solutionDocument.entityProfileFieldsPerEntityTypes;
                let filteredFieldsToBeShown = [];

                if (entityProfileFieldsPerEntityTypes) {
                    entityDocumentTypes.forEach(entityType => {
                        if (entityProfileFieldsPerEntityTypes[entityType]) {
                            filteredFieldsToBeShown.push(...entityProfileFieldsPerEntityTypes[entityType]);
                        }
                    })
                }

                entityProfileForm.profileForm.forEach(profileFormField => {
                    if (filteredFieldsToBeShown.includes(profileFormField.field)) {
                        profileFormField.value = (entityDocument.metaInformation[profileFormField.field]) ? entityDocument.metaInformation[profileFormField.field] : "";
                        profileFormField.visible = profileFieldAccessibility ? (profileFieldAccessibility.visible.indexOf("all") > -1 || profileFieldAccessibility.visible.indexOf(profileFormField.field) > -1) : true;
                        profileFormField.editable = profileFieldAccessibility ? (profileFieldAccessibility.editable.indexOf("all") > -1 || profileFieldAccessibility.editable.indexOf(profileFormField.field) > -1) : true;
                        form.push(profileFormField);
                    }
                })

                response.result.entityProfile = {
                    _id: entityDocument._id,
                    entityTypeId: entityDocument.entityTypeId,
                    entityType: entityDocument.entityType,
                    form: form
                };

                let solutionDocumentFieldList = await observationsHelper.solutionDocumentFieldListInResponse()

                response.result.solution = await _.pick(solutionDocument, solutionDocumentFieldList);

                let submissionDocument = {
                    entityId: entityDocument._id,
                    entityExternalId: (entityDocument.metaInformation.externalId) ? entityDocument.metaInformation.externalId : "",
                    entityInformation: entityDocument.metaInformation,
                    solutionId: solutionDocument._id,
                    solutionExternalId: solutionDocument.externalId,
                    frameworkId: solutionDocument.frameworkId,
                    frameworkExternalId: solutionDocument.frameworkExternalId,
                    entityTypeId: solutionDocument.entityTypeId,
                    entityType: solutionDocument.entityType,
                    observationId: observationDocument._id,
                    observationInformation: {
                        ..._.omit(observationDocument, ["_id", "entities", "deleted", "__v"])
                    },
                    createdBy: observationDocument.createdBy,
                    evidenceSubmissions: [],
                    entityProfile: {},
                    status: "started"
                };

                let assessment = {};

                assessment.name = solutionDocument.name;
                assessment.description = solutionDocument.description;
                assessment.externalId = solutionDocument.externalId;

                let criteriaId = new Array;
                let criteriaObject = {};
                let criteriaIdArray = gen.utils.getCriteriaIdsAndWeightage(solutionDocument.themes);

                criteriaIdArray.forEach(eachCriteriaId => {
                    criteriaId.push(eachCriteriaId.criteriaId);
                    criteriaObject[eachCriteriaId.criteriaId.toString()] = {
                        weightage: eachCriteriaId.weightage
                    };
                })

                let criteriaQuestionDocument = await database.models.criteriaQuestions.find(
                    { _id: { $in: criteriaId } },
                    {
                        resourceType: 0,
                        language: 0,
                        keywords: 0,
                        concepts: 0,
                        createdFor: 0
                    }
                ).lean();

                let evidenceMethodArray = {};
                let submissionDocumentEvidences = {};
                let submissionDocumentCriterias = [];
                Object.keys(solutionDocument.evidenceMethods).forEach(solutionEcm => {
                    if(!(solutionDocument.evidenceMethods[solutionEcm].isActive === false)) {
                        solutionDocument.evidenceMethods[solutionEcm].startTime = "";
                        solutionDocument.evidenceMethods[solutionEcm].endTime = "";
                        solutionDocument.evidenceMethods[solutionEcm].isSubmitted = false;
                        solutionDocument.evidenceMethods[solutionEcm].submissions = new Array;
                    } else {
                        delete solutionDocument.evidenceMethods[solutionEcm];
                    }
                })
                submissionDocumentEvidences = solutionDocument.evidenceMethods;

                criteriaQuestionDocument.forEach(criteria => {

                    criteria.weightage = criteriaObject[criteria._id.toString()].weightage;

                    submissionDocumentCriterias.push(
                        _.omit(criteria, [
                            "evidences"
                        ])
                    );

                    criteria.evidences.forEach(evidenceMethod => {

                        if (submissionDocumentEvidences[evidenceMethod.code] && evidenceMethod.code) {

                            if (!evidenceMethodArray[evidenceMethod.code]) {

                                evidenceMethod.sections.forEach(ecmSection => {
                                    ecmSection.name = solutionDocument.sections[ecmSection.code];
                                })
                                _.merge(evidenceMethod, submissionDocumentEvidences[evidenceMethod.code])
                                evidenceMethodArray[evidenceMethod.code] = evidenceMethod;

                            } else {

                                evidenceMethod.sections.forEach(evidenceMethodSection => {

                                    let sectionExisitsInEvidenceMethod = 0;
                                    let existingSectionQuestionsArrayInEvidenceMethod = [];

                                    evidenceMethodArray[evidenceMethod.code].sections.forEach(exisitingSectionInEvidenceMethod => {

                                        if (exisitingSectionInEvidenceMethod.code == evidenceMethodSection.code) {
                                            sectionExisitsInEvidenceMethod = 1;
                                            existingSectionQuestionsArrayInEvidenceMethod = exisitingSectionInEvidenceMethod.questions;
                                        }

                                    });

                                    if (!sectionExisitsInEvidenceMethod) {
                                        evidenceMethodSection.name = solutionDocument.sections[evidenceMethodSection.code];
                                        evidenceMethodArray[evidenceMethod.code].sections.push(evidenceMethodSection);
                                    } else {
                                        evidenceMethodSection.questions.forEach(questionInEvidenceMethodSection => {
                                            existingSectionQuestionsArrayInEvidenceMethod.push(
                                                questionInEvidenceMethodSection
                                            );
                                        });
                                    }

                                });

                            }

                        }

                    });

                });

                submissionDocument.evidences = submissionDocumentEvidences;
                submissionDocument.evidencesStatus = Object.values(submissionDocumentEvidences);
                submissionDocument.criteria = submissionDocumentCriterias;
                submissionDocument.submissionNumber = submissionNumber;

                let submissionDoc = await observationsHelper.findSubmission(
                    submissionDocument
                );

                assessment.submissionId = submissionDoc.result._id;

                const parsedAssessment = await assessmentsHelper.parseQuestions(
                    Object.values(evidenceMethodArray),
                    entityDocumentQuestionGroup,
                    submissionDoc.result.evidences,
                    (solutionDocument && solutionDocument.questionSequenceByEcm) ? solutionDocument.questionSequenceByEcm : false
                );

                assessment.evidences = parsedAssessment.evidences;
                assessment.submissions = parsedAssessment.submissions;
                if (parsedAssessment.generalQuestions && parsedAssessment.generalQuestions.length > 0) {
                    assessment.generalQuestions = parsedAssessment.generalQuestions;
                }

                response.result.assessment = assessment;

                return resolve(response);


            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
     * @api {get} /assessment/api/v1/observations/complete/:observationId Mark As Completed
     * @apiVersion 1.0.0
     * @apiName Mark As Completed
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/complete/:observationId
     * @apiUse successBody
     * @apiUse errorBody
     */


      /**
    * Observation mark as complete.
    * @method
    * @name complete
    * @param {Object} req -request Data.
    * @param {String} req.params._id -observation id. 
    * @returns {JSON} 
    */

    async complete(req) {

        return new Promise(async (resolve, reject) => {

            try {

                await database.models.observations.updateOne(
                    {
                        _id: ObjectId(req.params._id),
                        status: { $ne: "completed" },
                        createdBy: req.userDetails.id
                    },
                    {
                        $set: {
                            status: "completed"
                        }
                    }
                );

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_MARKED_COMPLETE
                })

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }

    /**
     * @api {get} /assessment/api/v1/observations/importFromFramework?frameworkId:frameworkExternalId&entityType=entityType Create observation solution from framework.
     * @apiVersion 1.0.0
     * @apiName Create observation solution from framework.
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParam {String} frameworkId Framework External ID.
     * @apiParam {String} entityType Entity Type.
     * @apiSampleRequest /assessment/api/v1/observations/importFromFramework?frameworkId=EF-SMC&entityType=school
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * Import observation from framework.
    * @method
    * @name importFromFramework
    * @param {Object} req -request Data.
    * @param {String} req.query.frameworkId -framework id.
    * @param {String} req.query.entityType - entity type name.   
    * @returns {JSON} 
    */

    async importFromFramework(req) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!req.query.frameworkId || req.query.frameworkId == "" || !req.query.entityType || req.query.entityType == "") {
                    throw messageConstants.apiResponses.INVALID_PARAMETER;
                }

                let frameworkDocument = await database.models.frameworks.findOne({
                    externalId: req.query.frameworkId
                }).lean();

                if (!frameworkDocument._id) {
                    throw messageConstants.apiResponses.INVALID_PARAMETER;
                }

                let entityTypeDocument = await database.models.entityTypes.findOne({
                    name: req.query.entityType,
                    isObservable: true
                }, {
                        _id: 1,
                        name: 1
                    }).lean();

                if (!entityTypeDocument._id) {
                    throw messageConstants.apiResponses.INVALID_PARAMETER;
                }

                let criteriasIdArray = gen.utils.getCriteriaIds(frameworkDocument.themes);

                let frameworkCriteria = await database.models.criteria.find({ _id: { $in: criteriasIdArray } }).lean();

                let solutionCriteriaToFrameworkCriteriaMap = {};

                await Promise.all(frameworkCriteria.map(async (criteria) => {
                    criteria.frameworkCriteriaId = criteria._id;

                    let newCriteriaId = await database.models.criteria.create(_.omit(criteria, ["_id"]));

                    if (newCriteriaId._id) {
                        solutionCriteriaToFrameworkCriteriaMap[criteria._id.toString()] = newCriteriaId._id;
                    }
                }))


                let updateThemes = function (themes) {
                    themes.forEach(theme => {
                        let criteriaIdArray = new Array;
                        let themeCriteriaToSet = new Array;
                        if (theme.children) {
                            updateThemes(theme.children);
                        } else {
                            criteriaIdArray = theme.criteria;
                            criteriaIdArray.forEach(eachCriteria => {
                                eachCriteria.criteriaId = solutionCriteriaToFrameworkCriteriaMap[eachCriteria.criteriaId.toString()] ? solutionCriteriaToFrameworkCriteriaMap[eachCriteria.criteriaId.toString()] : eachCriteria.criteriaId;
                                themeCriteriaToSet.push(eachCriteria);
                            })
                            theme.criteria = themeCriteriaToSet;
                        }
                    })
                    return true;
                }

                let newSolutionDocument = _.cloneDeep(frameworkDocument);

                updateThemes(newSolutionDocument.themes);

                newSolutionDocument.type = "observation";
                newSolutionDocument.subType = (frameworkDocument.subType && frameworkDocument.subType != "") ? frameworkDocument.subType : entityTypeDocument.name;

                newSolutionDocument.externalId = frameworkDocument.externalId + "-OBSERVATION-TEMPLATE";

                newSolutionDocument.frameworkId = frameworkDocument._id;
                newSolutionDocument.frameworkExternalId = frameworkDocument.externalId;

                newSolutionDocument.entityTypeId = entityTypeDocument._id;
                newSolutionDocument.entityType = entityTypeDocument.name;
                newSolutionDocument.isReusable = true;

                let newSolutionId = await database.models.solutions.create(_.omit(newSolutionDocument, ["_id"]));

                if (newSolutionId._id) {

                    let response = {
                        message: messageConstants.apiResponses.OBSERVATION_SOLUTION,
                        result: newSolutionId._id
                    };

                    return resolve(response);

                } else {
                    throw messageConstants.apiResponses.ERROR_CREATING_OBSERVATION;
                }

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        });
    }


    /**
     * @api {post} /assessment/api/v1/observations/bulkCreate Bulk Create Observations CSV
     * @apiVersion 1.0.0
     * @apiName Bulk Create Observations CSV
     * @apiGroup Observations
     * @apiParam {File} observation  Mandatory observation file of type CSV.
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * Upload bulk observations via csv.
    * @method
    * @name bulkCreate
    * @param {Object} req -request Data.
    * @param {CSV} req.files.observation -Observations csv data . 
    * @returns {CSV} - Same uploaded csv with extra field status indicating the particular
    * column is uploaded or not. 
    */

    async bulkCreate(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.files || !req.files.observation) {
                    let responseMessage = httpStatusCode.bad_request.message;
                    return resolve({ 
                        status: httpStatusCode.bad_request.status, 
                        message: responseMessage 
                    });
                }

                const fileName = `Observation-Upload-Result`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();

                let observationData = await csv().fromString(req.files.observation.data.toString());

                let users = [];
                let solutionExternalIds = [];
                let entityIds = [];

                observationData.forEach(eachObservationData => {
                    if (!eachObservationData["keycloak-userId"] && eachObservationData.user && !users.includes(eachObservationData.user)) {
                        users.push(eachObservationData.user);
                    }
                    solutionExternalIds.push(eachObservationData.solutionExternalId);
                    entityIds.push(ObjectId(eachObservationData.entityId));
                })

                let userIdByExternalId;

                if (users.length > 0) {
                    userIdByExternalId = await assessorsHelper.getInternalUserIdByExternalId(req.rspObj.userToken, users);
                }

                let entityDocument = await database.models.entities.find({
                    _id: {
                        $in: entityIds
                    }
                }, { _id: 1, entityTypeId: 1, entityType: 1 }).lean();

                let entityObject = {};

                if (entityDocument.length > 0) {
                    entityDocument.forEach(eachEntityDocument => {
                        entityObject[eachEntityDocument._id.toString()] = eachEntityDocument;
                    })
                }

                let solutionDocument = await database.models.solutions.find({
                    externalId: {
                        $in: solutionExternalIds
                    },
                    status: "active",
                    isDeleted: false,
                    isReusable: true,
                    type: "observation"
                }, {
                        externalId: 1,
                        frameworkExternalId: 1,
                        frameworkId: 1,
                        name: 1,
                        description: 1,
                        type: 1,
                        subType: 1
                    }).lean();

                let solutionObject = {};

                if (solutionDocument.length > 0) {
                    solutionDocument.forEach(eachSolutionDocument => {
                        solutionObject[eachSolutionDocument.externalId] = eachSolutionDocument;
                    })
                }


                for (let pointerToObservation = 0; pointerToObservation < observationData.length; pointerToObservation++) {
                    let solution;
                    let entityDocument;
                    let observationHelperData;
                    let currentData = observationData[pointerToObservation];
                    let csvResult = {};
                    let status;

                    Object.keys(currentData).forEach(eachObservationData => {
                        csvResult[eachObservationData] = currentData[eachObservationData];
                    })

                    let userId;

                    if (currentData["keycloak-userId"] && currentData["keycloak-userId"] !== "") {
                        userId = currentData["keycloak-userId"];
                    } else {

                        if (userIdByExternalId[currentData.user] === "") {
                            throw { status: httpStatusCode.bad_request.status, message: "Keycloak id for user is not present" };
                        }

                        userId = userIdByExternalId[currentData.user]
                    }

                    if (solutionObject[currentData.solutionExternalId] !== undefined) {
                        solution = solutionObject[currentData.solutionExternalId];
                    }

                    if (entityObject[currentData.entityId.toString()] !== undefined) {
                        entityDocument = entityObject[currentData.entityId.toString()];
                    }
                    if (entityDocument !== undefined && solution !== undefined && userId !== "") {
                        observationHelperData = await observationsHelper.bulkCreate(solution, entityDocument, userId);
                        status = observationHelperData.status;
                    } else {
                        status = messageConstants.apiResponses.ENTITY_SOLUTION_USER_NOT_FOUND;
                    }

                    csvResult["status"] = status;
                    input.push(csvResult);
                }
                input.push(null);
            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        });
    }

    /**
    * @api {post} /assessment/api/v1/observations/update/:observationId Update Observation Details
    * @apiVersion 1.0.0
    * @apiName Update Observation Details
    * @apiGroup Observations
    * @apiSampleRequest /assessment/api/v1/observations/update/5cd955487e100b4dded3ebb3
    * @apiUse successBody
    * @apiUse errorBody
    */

    /**
    * Update observations.
    * @method
    * @name update
    * @param {Object} req -request Data.
    * @param {String} req.body.name -name of the observation to update.
    * @param {String} req.body.description -description of the observation to update.   
    * @returns {JSON} message  
    */

    async update(req) {
        return new Promise(async (resolve, reject) => {

            try {

                let updateQuery = {};
                updateQuery["$set"] = {};

                if (req.body.name) {
                    updateQuery["$set"]["name"] = req.body.name;
                }

                if (req.body.description) {
                    updateQuery["$set"]["description"] = req.body.description;
                }

                let observationDocument = await database.models.observations.findOneAndUpdate(
                    {
                        _id: req.params._id,
                        createdBy: req.userDetails.userId,
                        status: { $ne: "inactive" }
                    },
                    updateQuery
                ).lean();

                if (!observationDocument) {
                    throw messageConstants.apiResponses.OBSERVATION_NOT_FOUND;
                }

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_UPDATED,
                });

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message
                });

            }


        })
    }

    /**
     * @api {get} /assessment/api/v1/observations/delete/:observationId Delete an Observation
     * @apiVersion 1.0.0
     * @apiName Delete an Observation
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/delete/:observationId
     * @apiUse successBody
     * @apiUse errorBody
     */

    /**
    * Delete observations.
    * @method
    * @name delete
    * @param {Object} req -request Data.
    * @param {String} req.params._id -observation id.  
    * @returns {JSON} message   
    */

    async delete(req) {

        return new Promise(async (resolve, reject) => {

            try {

                await database.models.observations.updateOne(
                    {
                        _id: ObjectId(req.params._id),
                        createdBy: req.userDetails.id
                    },
                    {
                        $set: {
                            status: "inactive"
                        }
                    }
                );

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_DELETED
                })

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }

        });

    }


    /**
     * @api {get} /assessment/api/v1/observations/pendingObservations Pending Observations
     * @apiVersion 1.0.0
     * @apiName Pending Observations
     * @apiGroup Observations
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/observations/pendingObservations
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
        {
            "message": "Pending Observations",
            "status": 200,
            "result": [
                {
                    "_id": "5d31a14dbff58d3d65ede344",
                    "userId": "e97b5582-471c-4649-8401-3cc4249359bb",
                    "solutionId": "5c6bd309af0065f0e0d4223b",
                    "createdAt": "2019-07-19T10:54:05.638Z",
                    "entityId": "5cebbefe5943912f56cf8e16",
                    "observationId": "5d1070326f6ed50bc34aec2c"
                }
            ]
        }
    */

      /**
    * Observations status not equal to completed.
    * @method
    * @name pendingObservations 
    * @returns {JSON} List of pending observations.   
    */

    async pendingObservations() {
        return new Promise(async (resolve, reject) => {
            try {

                let status = {
                    pending: true
                };

                let pendingObservationDocuments = await observationsHelper.pendingOrCompletedObservations(status);

                return resolve({
                    message: messageConstants.apiResponses.PENDING_OBSERVATION,
                    result: pendingObservationDocuments
                });


            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        });
    }

    /**
    * @api {get} /assessment/api/v1/observations/completedObservations Completed Observations
    * @apiVersion 1.0.0
    * @apiName Completed Observations
    * @apiGroup Observations
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/observations/completedObservations
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
        {
            "message": "Completed Observations",
            "status": 200,
            "result": [
                {
                    "_id": "5d2702e60110594953c1614a",
                    "userId": "e97b5582-471c-4649-8401-3cc4249359bb",
                    "solutionId": "5c6bd309af0065f0e0d4223b",
                    "createdAt": "2019-06-27T08:55:16.718Z",
                    "entityId": "5cebbefe5943912f56cf8e16",
                    "observationId": "5d1483c9869c433b0440c5dd"
                }
            ]
        }
    */

     /**
    * Observations status equal to completed.
    * @method
    * @name completedObservations 
    * @returns {JSON} List of completed observations.   
    */

    async completedObservations() {
        return new Promise(async (resolve, reject) => {
            try {

                let status = {
                    completed: true
                };

                let completedObservationDocuments = await observationsHelper.pendingOrCompletedObservations(status);

                return resolve({
                    message: messageConstants.apiResponses.COMPLETED_OBSERVATION,
                    result: completedObservationDocuments
                });

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode.internal_server_error.status,
                    message: error.message || httpStatusCode.internal_server_error.message,
                    errorObject: error
                });
            }
        });
    }

           /**
* @api {get} /assessment/api/v1/observations/details/:observationId 
* Observations details.
* @apiVersion 1.0.0
* @apiGroup Observations
* @apiHeader {String} X-authenticated-user-token Authenticity token
* @apiSampleRequest /assessment/api/v1/observations/details/5de8a220c210d4700813e695
* @apiUse successBody
* @apiUse errorBody
* @apiParamExample {json} Response:
{
    "message": "Observation details fetched successfully",
    "status": 200,
    "result": {
        "_id": "5d282bbcc1e91c71b6c025ee",
        "entities": [
            {
                "_id": "5d5bacc27b68e809c81f4994",
                "deleted": false,
                "entityTypeId": "5d28233dd772d270e55b4072",
                "entityType": "school",
                "metaInformation": {
                    "externalId": "1355120",
                    "districtId": "",
                    "districtName": "",
                    "zoneId": "NARELA",
                    "name": "SHAHBAD DAIRY C-I",
                    "types": [
                        "A1"
                    ],
                    "addressLine1": "",
                    "city": "New Delhi",
                    "pincode": "",
                    "state": "New Delhi",
                    "country": "India"
                },
                "updatedBy": "7996ada6-4d46-4e77-b350-390dee883892",
                "createdBy": "7996ada6-4d46-4e77-b350-390dee883892",
                "updatedAt": "2019-08-20T08:18:10.985Z",
                "createdAt": "2019-08-20T08:18:10.985Z",
                "__v": 0
            }
        ],
        "deleted": false,
        "name": "CRO-2019 By",
        "description": "CRO-2019m",
        "status": "inactive",
        "solutionId": "5d282bbcc1e91c71b6c025e6",
        "solutionExternalId": "CRO-2019-TEMPLATE",
        "frameworkId": "5d28233fd772d270e55b4199",
        "frameworkExternalId": "CRO-2019",
        "entityTypeId": "5d28233dd772d270e55b4072",
        "entityType": "school",
        "createdBy": "6e24b29b-8b81-4b70-b1b5-fa430488b1cf",
        "updatedAt": "2019-10-16T06:34:54.224Z",
        "createdAt": "2019-07-01T14:05:11.706Z",
        "startDate": "2018-07-12T06:05:50.963Z",
        "endDate": "2020-07-12T06:05:50.963Z",
        "__v": 0,
        "count": 11
    }
}
*/
      /**
      *  Observation details.
      * @method
      * @name details
      * @param  {Request} req request body.
      * @returns {JSON} Response consists of message,status and result.
      * Result will have the details of the observations including entities details.
     */

      /**
    * Observation details.
    * @method
    * @name details 
    * @param {Object} req request data
    * @param {String} req.params._id observation id. 
    * @returns {JSON} List of completed observations.   
    */

    async details(req) {
        return new Promise(async (resolve, reject) => {
            try {

                let observationDetails = await observationsHelper.details(req.params._id);

                return resolve({
                    message: messageConstants.apiResponses.OBSERVATION_FETCHED,
                    result: observationDetails
                });

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