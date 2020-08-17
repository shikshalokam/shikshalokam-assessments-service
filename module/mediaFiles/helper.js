/**
 * name : mediaFiles/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Media Files helper functionality.
 */

// Dependencies

/**
    * MediaFilesHelper
    * @class
*/
module.exports = class MediaFilesHelper {

    /**
   * find mediaFiles
   * @method
   * @name mediaFileDocuments
   * @param {Array} [mediaFileFilter = "all"] - media file ids.
   * @param {Array} [fieldsArray = "all"] - projected fields.
   * @param {Array} [skipFields = "none"] - field not to include
   * @returns {Array} List of mediaFiles. 
   */
  
  static mediaFileDocuments(
    mediaFileFilter = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (mediaFileFilter != "all") ? mediaFileFilter : {};
    
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
    
            let mediaFileDocuments = 
            await database.models.mediaFiles.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(mediaFileDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
 }

    /**
     * Create emoji.
     * @method 
     * @name createEmoji
     * @param {Object} 
     * @returns {String} - message.
     */

    static createEmoji() {
        return new Promise(async (resolve, reject) => {
            try {
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.EMOJI_CREATED,
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
     * Create gesture.
     * @method
     * @name createGesture
     * @param {Object} 
     * @returns {String} - message.
     */

    static createGesture() {
        return new Promise(async (resolve, reject) => {
            try {
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.GESTURE_CREATED,
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
     * Get emoji.
     * @method
     * @name getEmoji
     * @param {Object} 
     * @returns {JSON} - downloadable url.
     */

    static getEmoji() {
        return new Promise(async (resolve, reject) => {
            try {
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.EMOJI_FETCHED,
                    data: [{
                             name: "",
                             type: "",
                             url: "",
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
     * Get gesture.
     * @method
     * @name getGesture
     * @param {Object} 
     * @returns {JSON} - downloadable url. .
     */

    static getGesture() {
        return new Promise(async (resolve, reject) => {
            try {
               
                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.GESTURE_FETCHED,
                    data: [{
                        name: "",
                        type: "",
                        url: "",
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
}
