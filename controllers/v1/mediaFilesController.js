/**
 * name : mediaFilesController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Media Files information
 */

// Dependencies
const mediaFilesHelper = require(MODULES_BASE_PATH + "/mediaFiles/helper");


/**
    * Polls
    * @class
*/
module.exports = class MediaFiles extends Abstract {

    constructor() {
        super(mediaFilesSchema);
    }

    static get name() {
        return "mediaFiles";
    }

     /**
     * @api {post} /assessment/api/v1/mediaFiles/createEmoji Create Emoji
     * @apiVersion 1.0.0
     * @apiName Create Emoji
     * @apiGroup MediaFiles
     * @apiParamExample {json} Request-Body:
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Emoji.
    * @method
    * @name createEmoji
    * @param {Object} req -request Data.
    * @returns {String} - message .
    */

   createEmoji(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.createEmoji(
            );

            return resolve(result);

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
     * @api {post} /assessment/api/v1/mediaFiles/createGesture Create Gesture
     * @apiVersion 1.0.0
     * @apiName Create Gesture
     * @apiGroup MediaFiles
     * @apiParamExample {json} Request-Body:
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Gesture.
    * @method
    * @name createGesture
    * @param {Object} req -request Data.
    * @returns {JSON} - .
    */

   createGesture(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.createGesture(
            );

            return resolve(result);

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
     * @api {get} /assessment/api/v1/mediaFiles/getGesture Get Gesture
     * @apiVersion 1.0.0
     * @apiName Get Gesture
     * @apiGroup MediaFiles
     * @apiParamExample {json} Request-Body:
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get Gesture.
    * @method
    * @name getGesture
    * @param {Object} req -request Data.
    * @returns {JSON} - .
    */

    getGesture(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.getGesture(
            );

            return resolve({
                message: messageConstants.apiResponses,
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
     * @api {get} /assessment/api/v1/mediaFiles/getEmoji Get Emoji
     * @apiVersion 1.0.0
     * @apiName Get Emoji
     * @apiGroup MediaFiles
     * @apiParamExample {json} Request-Body:
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get Emoji.
    * @method
    * @name getEmoji
    * @param {Object} req -request Data.
    * @returns {JSON} - .
    */

   getEmoji(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await mediaFilesHelper.getEmoji(
            );

            return resolve({
                message: messageConstants.apiResponses,
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


}
