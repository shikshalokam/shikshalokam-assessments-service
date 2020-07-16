/**
 * name : observationSubmissions/helper.js
 * author : Akash
 * created-date : 20-Jan-2019
 * Description : Observations Submissions helper functionality.
 */

// Dependencies

let slackClient = require(ROOT_PATH + "/generics/helpers/slackCommunications");
let kafkaClient = require(ROOT_PATH + "/generics/helpers/kafkaCommunications");
const emailClient = require(ROOT_PATH + "/generics/helpers/emailCommunications");
const scoringHelper = require(MODULES_BASE_PATH + "/scoring/helper")
const criteriaHelper = require(MODULES_BASE_PATH + "/criteria/helper")
const questionsHelper = require(MODULES_BASE_PATH + "/questions/helper")
const programsHelper = require(MODULES_BASE_PATH + "/programs/helper")

/**
    * ObservationSubmissionsHelper
    * @class
*/
module.exports = class ObservationSubmissionsHelper {

      /**
   * List of observation submissions
   * @method
   * @name observationSubmissionsDocument
   * @param {Object} [findQuery = "all"] - filtered data.
   * @param {Array} [fields = "all"] - projected data.
   * @param {Array} [sortedData = "all"] - sorted field.
   * @param {Array} [skipFields = "none"] - fields to skip.
   * @returns {Array} - List of observation submissions data.
   */

  static observationSubmissionsDocument(
      findQuery = "all", 
      fields = "all",
      sortedData = "all",
      skipFields = "none"
    ) {
    return new Promise(async (resolve, reject) => {
        try {
            
            let queryObject = {};

            if (findQuery != "all") {
                queryObject = findQuery;
            }

            let projection = {};

            if (fields != "all") {
                fields.forEach(element => {
                    projection[element] = 1;
                });
            }

            if (skipFields != "none") {
                skipFields.forEach(element => {
                    projection[element] = 0;
                });
            }

            let submissionDocuments;

            if ( sortedData !== "all" ) {
                
                submissionDocuments = 
                await database.models.observationSubmissions.find(
                    queryObject, 
                    projection
                ).sort(sortedData).lean();

            } else {
                
                submissionDocuments = 
                await database.models.observationSubmissions.find(
                    queryObject, 
                    projection
                ).lean();
            }   
            
            return resolve(submissionDocuments);
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
   * Push completed observation submission in kafka for reporting.
   * @method
   * @name pushCompletedObservationSubmissionForReporting
   * @param {String} observationSubmissionId - observation submission id.
   * @returns {JSON} - message that observation submission is pushed to kafka.
   */

    static pushCompletedObservationSubmissionForReporting(observationSubmissionId) {
        return new Promise(async (resolve, reject) => {
            try {

                if (observationSubmissionId == "") {
                    throw "No observation submission id found";
                }

                if( typeof observationSubmissionId == "string" ) {
                    observationSubmissionId = ObjectId(observationSubmissionId);
                }

                let observationSubmissionsDocument = await database.models.observationSubmissions.findOne({
                    _id: observationSubmissionId,
                    status: "completed"
                }).lean();

                if (!observationSubmissionsDocument) {
                    throw messageConstants.apiResponses.SUBMISSION_NOT_FOUND+"or"+messageConstants.apiResponses.SUBMISSION_STATUS_NOT_COMPLETE;
                }

                const kafkaMessage = await kafkaClient.pushCompletedObservationSubmissionToKafka(observationSubmissionsDocument);

                if(kafkaMessage.status != "success") {
                    let errorObject = {
                        formData: {
                            observationSubmissionId:observationSubmissionsDocument._id.toString(),
                            message:kafkaMessage.message
                        }
                    };
                    slackClient.kafkaErrorAlert(errorObject);
                }

                return resolve(kafkaMessage);

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Push incomplete observation submission for reporting.
   * @method
   * @name pushInCompleteObservationSubmissionForReporting
   * @param {String} observationSubmissionId - observation submission id.
   * @returns {JSON} consists of kafka message whether it is pushed for reporting
   * or not.
   */

    static pushInCompleteObservationSubmissionForReporting(observationSubmissionId) {
        return new Promise(async (resolve, reject) => {
            try {

                if (observationSubmissionId == "") {
                    throw "No observation submission id found";
                }

                if(typeof observationSubmissionId == "string") {
                    observationSubmissionId = ObjectId(observationSubmissionId);
                }

                let observationSubmissionsDocument = await database.models.observationSubmissions.findOne({
                    _id: observationSubmissionId,
                    status: {$ne : "completed"}
                }).lean();

                if (!observationSubmissionsDocument) {
                    throw messageConstants.apiResponses.SUBMISSION_NOT_FOUND+"or"+messageConstants.apiResponses.SUBMISSION_STATUS_NOT_COMPLETE;
                }
            
                const kafkaMessage = await kafkaClient.pushInCompleteObservationSubmissionToKafka(observationSubmissionsDocument);

                if(kafkaMessage.status != "success") {
                    let errorObject = {
                        formData: {
                            observationSubmissionId:observationSubmissionsDocument._id.toString(),
                            message:kafkaMessage.message
                        }
                    };
                    slackClient.kafkaErrorAlert(errorObject);
                }

                return resolve(kafkaMessage);

            } catch (error) {
                return reject(error);
            }
        })
    }

     /**
   * Push observation submission to queue for rating.
   * @method
   * @name pushObservationSubmissionToQueueForRating
   * @param {String} [observationSubmissionId = ""] -observation submission id.
   * @returns {JSON} - message
   */

    static pushObservationSubmissionToQueueForRating(observationSubmissionId = "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (observationSubmissionId == "") {
                    throw messageConstants.apiResponses.OBSERVATION_SUBMISSION_ID_NOT_FOUND;
                }


                if(typeof observationSubmissionId !== "string") {
                    observationSubmissionId = observationSubmissionId.toString();
                }

                const kafkaMessage = await kafkaClient.pushObservationSubmissionToKafkaQueueForRating({submissionModel : "observationSubmissions",submissionId : observationSubmissionId});

                if(kafkaMessage.status != "success") {
                    let errorObject = {
                        formData: {
                            submissionId:observationSubmissionId,
                            submissionModel:"observationSubmissions",
                            message:kafkaMessage.message
                        }
                    };
                    slackClient.kafkaErrorAlert(errorObject);
                }

                return resolve(kafkaMessage);

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * Rate submission by id.
     * @method
     * @name rateSubmissionById
     * @param {String} [submissionId = ""] -submission id.
     * @returns {JSON} - message
     */

    static rateSubmissionById(submissionId = "") {
        return new Promise(async (resolve, reject) => {

            let emailRecipients = (process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS && process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS != "") ? process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS : "";

            try {

                if (submissionId == "") {
                    throw new Error(messageConstants.apiResponses.OBSERVATION_SUBMISSION_ID_NOT_FOUND);
                }

                let submissionDocument = await database.models.observationSubmissions.findOne(
                    {_id : ObjectId(submissionId)},
                    { "answers": 1, "criteria": 1, "evidencesStatus": 1, "entityInformation": 1, "entityProfile": 1, "solutionExternalId": 1, "programExternalId": 1 }
                ).lean();
        
                if (!submissionDocument._id) {
                    throw new Error(messageConstants.apiResponses.OBSERVATION_SUBMISSSION_NOT_FOUND);
                }

                let solutionDocument = await database.models.solutions.findOne({
                    externalId: submissionDocument.solutionExternalId,
                    type : "observation",
                    scoringSystem : "pointsBasedScoring"
                }, { themes: 1, levelToScoreMapping: 1, scoringSystem : 1, flattenedThemes : 1, sendSubmissionRatingEmailsTo : 1}).lean();

                if (!solutionDocument) {
                    throw new Error(messageConstants.apiResponses.SOLUTION_NOT_FOUND);
                }

                if(solutionDocument.sendSubmissionRatingEmailsTo && solutionDocument.sendSubmissionRatingEmailsTo != "") {
                    emailRecipients = solutionDocument.sendSubmissionRatingEmailsTo;
                }

                submissionDocument.submissionCollection = "observationSubmissions";
                submissionDocument.scoringSystem = "pointsBasedScoring";

                let allCriteriaInSolution = new Array;
                let allQuestionIdInSolution = new Array;
                let solutionQuestions = new Array;

                allCriteriaInSolution = gen.utils.getCriteriaIds(solutionDocument.themes);

                if(allCriteriaInSolution.length > 0) {
                
                    submissionDocument.themes = solutionDocument.flattenedThemes;

                    let allCriteriaDocument = await criteriaHelper.criteriaDocument({
                        _id : {
                            $in : allCriteriaInSolution
                        }
                    }, [
                        "evidences"
                    ]);

                    allQuestionIdInSolution = gen.utils.getAllQuestionId(allCriteriaDocument);
                }

                if(allQuestionIdInSolution.length > 0) {

                    solutionQuestions = await questionsHelper.questionDocument({
                        _id : {
                        $in : allQuestionIdInSolution
                        },
                        responseType : {
                        $in : [
                            "radio",
                            "multiselect",
                            "slider"
                        ]
                        }
                    }, [
                        "weightage",
                        "options",
                        "sliderOptions",
                        "responseType"
                    ]);

                }

                if(solutionQuestions.length > 0) {
                submissionDocument.questionDocuments = {};
                solutionQuestions.forEach(question => {
                    submissionDocument.questionDocuments[question._id.toString()] = {
                    _id : question._id,
                    weightage : question.weightage
                    };
                    let questionMaxScore = 0;
                    if(question.options && question.options.length > 0) {
                    if(question.responseType != "multiselect") {
                        questionMaxScore = _.maxBy(question.options, 'score').score;
                    }
                    question.options.forEach(option => {
                        if(question.responseType == "multiselect") {
                        questionMaxScore += option.score;
                        }
                        (option.score && option.score > 0) ? submissionDocument.questionDocuments[question._id.toString()][`${option.value}-score`] = option.score : "";
                    })
                    }
                    if(question.sliderOptions && question.sliderOptions.length > 0) {
                    questionMaxScore = _.maxBy(question.sliderOptions, 'score').score;
                    submissionDocument.questionDocuments[question._id.toString()].sliderOptions = question.sliderOptions;
                    }
                    submissionDocument.questionDocuments[question._id.toString()].maxScore =  (typeof questionMaxScore === "number") ? questionMaxScore : 0;
                })
                }

                let resultingArray = await scoringHelper.rateEntities([submissionDocument], "singleRateApi");

                if(resultingArray.result.runUpdateQuery) {
                    await database.models.observationSubmissions.updateOne(
                        {
                            _id: ObjectId(submissionId)
                        },
                        {
                            status: "completed",
                            completedDate: new Date()
                        }
                    );
                    await this.pushCompletedObservationSubmissionForReporting(submissionId);
                    emailClient.pushMailToEmailService(emailRecipients,messageConstants.apiResponses.OBSERVATION_AUTO_RATING_SUCCESS+" - "+submissionId,JSON.stringify(resultingArray));
                    return resolve(messageConstants.apiResponses.OBSERVATION_RATING);
                } else {
                    emailClient.pushMailToEmailService(emailRecipients,messageConstants.apiResponses.OBSERVATION_AUTO_RATING_FAILED+" - "+submissionId,JSON.stringify(resultingArray));
                    return resolve(messageConstants.apiResponses.OBSERVATION_RATING);
                }

            } catch (error) {
                emailClient.pushMailToEmailService(emailRecipients,messageConstants.apiResponses.OBSERVATION_AUTO_RATING_FAILED+" - "+submissionId,error.message);
                return reject(error);
            }
        })
    }

    /**
     * Mark observation submission complete and push to Kafka.
     * @method
     * @name markCompleteAndPushForReporting
     * @param {String} [submissionId = ""] -submission id.
     * @returns {JSON} - message
     */

    static markCompleteAndPushForReporting(submissionId = "") {
        return new Promise(async (resolve, reject) => {

            let emailRecipients = (process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS && process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS != "") ? process.env.SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS : "";

            try {

                if (submissionId == "") {
                    throw new Error(messageConstants.apiResponses.OBSERVATION_SUBMISSION_ID_NOT_FOUND);
                } else if (typeof submissionId !== "string") {
                    submissionId = submissionId.toString()
                }

                let submissionDocument = await database.models.observationSubmissions.findOne(
                    {_id : ObjectId(submissionId)},
                    { "_id": 1}
                ).lean();
        
                if (!submissionDocument._id) {
                    throw new Error(messageConstants.apiResponses.OBSERVATION_SUBMISSSION_NOT_FOUND);
                }

                await database.models.observationSubmissions.updateOne(
                    {
                        _id: ObjectId(submissionId)
                    },
                    {
                        status: "completed",
                        completedDate: new Date()
                    }
                );
                
                await this.pushCompletedObservationSubmissionForReporting(submissionId);
                
                emailClient.pushMailToEmailService(emailRecipients,"Successfully marked submission " + submissionId + "complete and pushed for reporting","NO TEXT AVAILABLE");
                return resolve(messageConstants.apiResponses.OBSERVATION_RATING);

            } catch (error) {
                emailClient.pushMailToEmailService(emailRecipients,messageConstants.apiResponses.OBSERVATION_AUTO_RATING_FAILED+" - "+submissionId,error.message);
                return reject(error);
            }
        })
    }

    /**
    * List observation submissions
    * @method
    * @name list
    * @param {String} - entityId
    * @param {String} - solutionId
    * @param {String} - observationId
    * @returns {Object} - list of submissions
    */

   static list(entityId,observationId) {
    return new Promise(async (resolve, reject) => {
        try {
            
            let queryObject = {
                entityId: entityId,
                observationId: observationId
            };

            let projection = [
                "status",
                "submissionNumber",
                "entityId",
                "entityExternalId",
                "entityType",
                "createdAt",
                "updatedAt",
                "title",
                "completedDate",
                "ratingCompletedAt",
                "observationInformation.name",
                "observationId"
            ];

            let result = await this.observationSubmissionsDocument
            (
                 queryObject,
                 projection,
                 {
                     "createdAt" : -1 
                }
            );

            if( !result.length > 0 ) {
                throw {
                    status : httpStatusCode.bad_request.status,
                    message : messageConstants.apiResponses.SUBMISSION_NOT_FOUND
                }
            }

            result = result.map(resultedData=>{
                resultedData.submissionId = resultedData._id;
                resultedData.submissionStatus = resultedData.status;
                resultedData.observationName =  
                resultedData.observationInformation && resultedData.observationInformation.name ? 
                resultedData.observationInformation.name : "";

                resultedData.submissionDate = resultedData.completedDate ? resultedData.completedDate : "";
                resultedData.ratingCompletedAt = resultedData.ratingCompletedAt ? resultedData.ratingCompletedAt : "";

                delete resultedData.observationInformation;
                return _.omit(resultedData,["_id","status","completedDate"]);
            })

            return resolve({
                message : messageConstants.apiResponses.OBSERVATION_SUBMISSIONS_LIST_FETCHED,
                result : result
            })
        } catch (error) {
            return reject(error);
        }
    });
   }

};


