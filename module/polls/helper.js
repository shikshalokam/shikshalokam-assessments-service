/**
 * name : polls/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Polls helper functionality.
 */

// Dependencies
const formsHelper = require(MODULES_BASE_PATH + "/forms/helper");
const pollLinkBaseUrl = process.env.POLL_LINK_BASE_URL ? process.env.POLL_LINK_BASE_URL : "samiksha://shikshalokam.org/take-poll/";
const mediaFilesHelper = require(MODULES_BASE_PATH + "/mediaFiles/helper");

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
                
                let unicodes = await mediaFilesHelper.mediaFileDocuments
                ( 
                    {
                        status: "active"
                    }
                )

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
                    creator: pollData.creator,
                    createdBy: userId,
                    startDate: new Date(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + pollData.endDate)),
                    metaInformation: pollData.metaInformation,
                    isDeleted: false,
                    status: "active"
                }
                
                let questionArray = [];
                pollData.questions.forEach ( question => {
                    
                    let options = [];
                    question.qid = gen.utils.generateUUId();
                    
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

                let link = await gen.utils.md5Hash(userId + "###" + createPollResult._id);

                await database.models.polls.updateOne
                (
                    { _id : createPollResult._id },
                    {
                        $set : { link : link}
                    }
                )

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_CREATED,
                    data: {
                        link : pollLinkBaseUrl + link
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
                        createdBy: userId
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
     * @name getPollQuestions
     * @param {String} pollId - pollId 
     * @returns {JSON} - poll questions and options.
     */

    static getPollQuestions(pollId= "") {
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
                        "questions"
                    ]
                )

                if (!pollQuestions.length) {
                    throw new Error(messageConstants.apiResponses.POLL_NOT_FOUND)
                }
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_QUESTIONS_FETCHED,
                    data: pollQuestions[0].questions
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
     * Get the poll questions by link.
     * @method
     * @name getPollQuestionsByLink
     * @param {String} link - link 
     * @returns {JSON} - poll questions and options.
     */

    static getPollQuestionsByLink(link= "") {
        return new Promise(async (resolve, reject) => {
            try {

                if (link == "") {
                    throw new Error(messageConstants.apiResponses.LINK_REQUIRED_CHECK)
                }

                let pollQuestions = await this.pollDocuments
                (
                    {
                      link: link
                    },
                    [    
                        "questions",
                        "status",
                        "endDate"
                    ]
                )
                
                if (!pollQuestions.length) {
                    throw new Error(messageConstants.apiResponses.POLL_NOT_FOUND)
                }

                if (new Date() > new Date(pollQuestions[0].endDate)) {
                    
                    if (pollQuestions[0].status == messageConstants.common.ACTIVE_STATUS) {
                        await database.models.polls.updateOne
                        (
                            { $set : { status: messageConstants.common.INACTIVE_STATUS } }
                        )
                    }
                    
                    throw new Error(messageConstants.apiResponses.LINK_IS_EXPIRED)
                }
                else {

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_QUESTIONS_FETCHED,
                    data: pollQuestions[0].questions
                });

                }
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
    * Poll report.
    * @method
    * @name report
    * @param {String} pollId - pollId 
    * @returns {Object} - Poll report data
    */

   static report(pollId = "") {
    return new Promise(async (resolve, reject) => {
        try {

            if (pollId == "") {
                throw new Error (messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK)
            }

            let pollDocument = await this.pollDocuments
            (
                { _id : pollId },
                [
                    "result",
                    "numberOfResponses"
                ]
            )

            if (!pollDocument.length) {
                throw new Error(messageConstants.apiResponses.POLL_NOT_FOUND)
            }
            
            let reports = [];

            let report = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                accessibility: {
                    announceNewData: {
                        enabled: false
                    }
                },
                xAxis: {
                    type: 'category'
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },
                series: [
                    {
                        colorByPoint: true,
                        data: []
                    }
                ]
            }
            
            let result = pollDocument[0].result;

            Object.keys(result).forEach( singleQuestion => {

                report.title.text = singleQuestion.question;

                for (let answer in result[singleQuestion].responses) {
                    console.log(answer);
                    report.series[0].data.push ({
                        name: answer,
                        y: (result[singleQuestion].responses[answer]/pollDocument[0].numberOfResponses) * 100
                    })   
                }

                reports.push(report);
            })

            return resolve({
                success: true,
                message: messageConstants.apiResponses.POLL_REPORT_CREATED,
                data : reports
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
    * Update poll document.
    * @method
    * @name updatePollDocument
    * @param {String} pollId - pollId
    * @param {Array} updateObject - fields to update
    * @returns {String} - message.
    */

   static updatePollDocument(pollId= "", updateObject= {}) {
    return new Promise(async (resolve, reject) => {
        try {

            if (pollId == "") {
                throw new Error(messageConstants.apiResponses.POLL_ID_REQUIRED_CHECK)
            }

            if (Object.keys(updateObject).length == 0) {
                throw new Error (messageConstants.apiResponses.UPDATE_OBJECT_REQUIRED)
            }

            await database.models.polls.updateOne
            (
                { _id : pollId},
                updateObject
            )

            return resolve({
                success: true,
                message: messageConstants.apiResponses.POLL_UPDATED,
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
