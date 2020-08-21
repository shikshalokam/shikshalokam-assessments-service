/**
 * name : polls/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Polls helper functionality.
 */

// Dependencies
const formsHelper = require(MODULES_BASE_PATH + "/forms/helper");
const uuid = require('uuid/v1');
const ObjectID = require('mongodb').ObjectID;
const pollLinkBaseUrl = process.env.POLL_LINK_BASE_URL ? process.env.POLL_LINK_BASE_URL : "samiksha://shikshalokam.org/take-poll/";

/**
    * PollsHelper
    * @class
*/
module.exports = class PollsHelper {

   /**
   * find polls
   * @method
   * @name pollDocuments
   * @param {Array} [pollFilter = "all"] - poll ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of polls. 
   */
  
  static pollDocuments(
    pollFilter = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (pollFilter != "all") ? pollFilter : {};
    
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
    
            let pollDocuments = 
            await database.models.polls.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(pollDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
 }

    /**
     * Poll Creation meta form
     * @method
     * @name metaForm
     * @returns {JSON} - Form details
     */

    static metaForm() {
        return new Promise(async (resolve, reject) => {
            try {

                let pollCreationForm = await formsHelper.formDocuments
                (
                    {
                      name : {
                               $in : [
                                  messageConstants.common.POLL_METAFORM,
                                  messageConstants.common.POLL_QUESTION_METAFORM
                                ]
                            }
                    },
                    [
                      "value"
                    ]
                )

                pollCreationForm = [...pollCreationForm[0].value,
                                    ...pollCreationForm[1].value]
                
                let unicodes = await database.models.mediaFiles.find
                ( 
                    {
                        status: "active"
                    }
                ).lean();

                let emojis = [];
                let gestures = [];

                if (unicodes.length > 0) {
                    unicodes.forEach( unicode => {
                         if (unicode.type == messageConstants.common.EMOJI) {
                             emojis.push(unicode);
                         }
                         else if (unicode.type == messageConstants.common.GESTURE){
                             gestures.push(unicode);
                         }
                    });
                }

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_CREATION_FORM_FETCHED,
                    data: {
                          form: pollCreationForm,
                          emojis: emojis,
                          gestures: gestures
                    }
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

    /**
     * Create poll
     * @method
     * @name create
     * @param {Object} pollData - poll creation data
     * @param {String} userId - userId
     * @returns {String} - Sharable link .
     */

    static create(pollData= {}, userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (Object.keys(pollData).length == 0) {
                    throw new Error (messageConstants.apiResponses.POLL_DATA_REQUIRED);
                }

                if (userId == "") {
                    throw new Error (messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
                }

                let pollDocument = {
                    name: pollData.name,
                    creator: userId,
                    startDate: new Date(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + pollData.endDate)),
                    link: uuid(),
                    isDeleted: false,
                    status: "active"
                }
                
                let questionArray = [];
                pollData.questions.forEach ( question => {
                    
                    let options = [];
                    question.qid = new ObjectID();
                    
                    if (question.options.length > 0) {
                        let i = 1;
                        question.options.forEach( option => {
                            options.push(
                               {
                                 value: "R" + i,
                                 label: option.label,
                                 unicode: option.value
                               }
                           )

                           ++i
                        })
                    }

                    question.options = options;
                    questionArray.push(question);
                });
                
                pollDocument.questions = questionArray;
                
                let createPollResult = await database.models.polls.create(pollDocument)

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_CREATED,
                    data: {
                        link : pollLinkBaseUrl + pollDocument.link + "/" + createPollResult._id
                    }
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

    /**
    * List all the polls.
    * @method
    * @name list
    * @param {String} userId - userId
    * @returns {JSON} - Polls list.
    */

    static list(userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(userId == ""){
                    throw new Error(messageConstants.apiResponses.USER_ID_REQUIRED_CHECK);
                }

                let pollsList = await this.pollDocuments
                (
                    {
                        creator: userId
                    },
                    [
                        "name"
                    ]
                )

                if (!pollsList.length) {
                    throw new Error(messageConstants.apiResponses.POLL_NOT_FOUND)
                }

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLLS_LIST_FETCHED,
                    data: pollsList
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


    /**
     * Delete an poll.
     * @method
     * @name delete
     * @param {String} pollId - pollId 
     * @returns {String} - message.
     */

    static delete(pollId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if(pollId == ""){
                    throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK);
                }

                await database.models.polls.updateOne
                (
                    { _id: pollId },
                    { $set : {
                        isDeleted: true
                      }
                    }
                );

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_DELETED,
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
    

    /**
     * Get the poll questions.
     * @method
     * @name getpollQuestions
     * @param {String} pollId - pollId 
     * @returns {JSON} - poll questions and options.
     */

    static getpollQuestions(pollId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (pollId == "") {
                    throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK)
                }

                let pollQuestions = await this.pollDocuments
                (
                    {
                      _id: pollId
                    },
                    [    
                        "endDate",
                        "questions",
                        "status"
                    ]
                )

                if (!pollQuestions.length) {
                    throw new Error(messageConstants.apiResponses.POLL_NOT_FOUND)
                }
                
                let result = {
                    questions : pollQuestions[0].questions
                };
                
                if (new Date() > new Date(pollQuestions[0].endDate)) {

                    result.active = false;

                    if (pollQuestions[0].status == "active") {
                        await database.models.polls.updateOne
                        (
                            { _id: pollId },
                            {
                                $set: {
                                    status: "inactive"
                                }
                            }
                        )
                    }
                }

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_QUESTIONS_FETCHED,
                    data: result
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
