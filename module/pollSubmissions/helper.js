/**
 * name : pollSubmissions/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : PollSubmissions helper functionality.
 */

// Dependencies
const pollsHelper = require(MODULES_BASE_PATH + "/polls/helper");

/**
    * PollSubmissionsHelper
    * @class
*/
module.exports = class PollSubmissionsHelper {

   /**
   * find pollSubmissions
   * @method
   * @name pollSubmissionDocuments
   * @param {Array} [pollSubmissionFilter = "all"] - poll submission ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of pollSubmissions. 
   */
  
  static pollSubmissionDocuments(
    pollSubmissionFilter = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (pollSubmissionFilter != "all") ? pollSubmissionFilter : {};
    
            let projection = {}
    
            if (fieldsArray != "all") {
                fieldsArray.forEach(field => {
                    projection[field] = 1;
                });
            }

            if( skipFields !== "none" ) {
              skipFields.forEach(field=>{
                projection[field] = 0;
              })
            }
    
            let pollSubmissionDocuments = 
            await database.models.pollSubmissions.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(pollSubmissionDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
 }


    /**
    * Make poll submission.
    * @method
    * @name make
    * @param {String} pollId - pollId
    * @param {Array} responseObject - Questions and answers object
    * @param {String} userId - userId
    * @returns {String} - message.
    */

    static make(pollId= "", responseObject= {}, userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (pollId == "") {
                    throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK)
                }

                if (Object.keys(responseObject).length == 0) {
                    throw new Error (messageConstants.apiResponses.RESPONSE_OBJECT_REQUIRED_CHECK)
                }

                if (userId == "") {
                    throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK)
                }

                let pollSubmissionDocument = await this.pollSubmissionDocuments
                (
                   {
                       userId: userId,
                       pollId: pollId
                   }
                )

                if (pollSubmissionDocument.length > 0) {
                    throw new Error(messageConstants.apiResponses.MULTIPLE_SUBMISSIONS_NOT_ALLOWED)
                }

                let pollDocument = await pollsHelper.pollDocuments
                (
                    {
                        _id: pollId
                    },
                    [
                        "name",
                        "numberOfResponses",
                        "result"
                    ]
                )
                 
                 pollSubmissionDocument = {
                    pollName: pollDocument[0].name,
                    pollId: pollId,
                    submittedAt: new Date(),
                    responses: responseObject,
                    isDeleted: false,
                    userId: userId,
                    status: "active"
                }

                await database.models.pollSubmissions.create(pollSubmissionDocument);

                let result = pollDocument[0]["result"] ? pollDocument[0]["result"] : {}
                
                Object.values(responseObject).forEach(singleResponse => {
                    if (!result[singleResponse.qid]) {
                        result[singleResponse.qid] = {
                            question: singleResponse.question,
                            responses: {}
                        }
                    }
                
                    if (Array.isArray(singleResponse.label)) {
                        singleResponse.label.forEach(label => {
                            if (!result[singleResponse.qid].responses[label]) {
                                result[singleResponse.qid].responses[label] = 1;
                            }
                            else {
                                result[singleResponse.qid].responses[label] = result[singleResponse.qid].responses[label] + 1;
                            }
                        })
                    }
                    else {
                        if (!result[singleResponse.qid].responses[singleResponse.label]) {
                            result[singleResponse.qid].responses[singleResponse.label] = 1;
                        }
                        else {
                            result[singleResponse.qid].responses[singleResponse.label] = result[singleResponse.qid].responses[singleResponse.label] + 1;
                        }
                    }
                })

                await database.models.polls.updateOne
                 (
                     { _id: pollId },
                     { $set : { result: result },
                       $inc: { numberOfResponses : 1 }
                     }
                 )

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_SUBMITTED,
                    data: true
                });

            } catch (error) {
                return resolve({
                    success: false,
                    message: error.message,
                    data: false
                });
            }
        });
    }
}