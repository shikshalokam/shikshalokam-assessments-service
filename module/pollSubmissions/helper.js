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

                let pollDocument = await pollsHelper.pollDocument
                (
                    {
                        _id: pollId
                    },
                    [
                        "name"
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

                await database.models.pollSubmissions.insertOne(pollSubmissionDocument);

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

            let pollSubmissionDocuments = await this.pollSubmissionDocuments
            (
                { pollId : pollId },
                [
                    "responses"
                ]
            )

            if (!pollSubmissionDocuments.length) {
                throw new Error(messageConstants.apiResponses.POLL_SUBMISSION_DOCUMENTS_NOT_FOUND)
            }
            
            let questionArray = [];
            
            pollSubmissionDocuments.forEach ( singleDocument => {
                questionArray = questionArray.concat(Object.values(singleDocument.responses));
            })
            
            let groupByQuestionId = _.groupBy(questionArray, 'qid');
            let questionIds = Object.keys(groupByQuestionId);
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

            questionIds.forEach ( questionId => {
                let answerArray = [];
                let labelArray = [];
                let dataArray = [];
                let totalSubmissions = groupByQuestionId[questionId].length;

                groupByQuestionId[questionId].forEach ( singleQuestion => {
                    report.title.text = singleQuestion.question;
                    if (Array.isArray(singleQuestion.label)) {
                        answerArray = answerArray.concat(singleQuestion.label);
                    }
                    else {
                        answerArray.push(singleQuestion.label);
                    }
                })

                answerArray = answerArray.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})

                for (let answer in answerArray) {
                    labelArray.push(answer)
                    dataArray.push({
                        name: answer,
                        y: (answerArray[answer]/totalSubmissions) * 100
                    })
                }
                
                report.series[0].data = dataArray;
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
   
}