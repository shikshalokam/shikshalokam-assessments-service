/**
 * name : pollSubmissions/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : PollSubmissions helper functionality.
 */

// Dependencies

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
  
  static pollDocuments(
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
    * @param {Array} responseArray - Questions and answers
    * @returns {String} - message.
    */

    static make(pollId= "", responseArray= [] ) {
        return new Promise(async (resolve, reject) => {
            try {

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
    * List poll names.
    * @method
    * @name listPollNames
    * @param {String} userId - userId 
    * @returns {Object} - list of poll names
    */

   static listPollNames(userId= "") {
    return new Promise(async (resolve, reject) => {
        try {
           
            return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_NAME_FETCHED,
                    result: [{
                        pollId: "5e7c8062afc9976997c1e974",
                        pollName: "meeting feedback",
                        organisationName: "Shikshalokam"
                    }]
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
           
            return resolve({
                success: true,
                message: messageConstants.apiResponses.POLL_REPORT_CREATED,
                data : []
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