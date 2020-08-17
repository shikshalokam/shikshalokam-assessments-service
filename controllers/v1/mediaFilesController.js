/**
 * name : mediaFilesController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Media Files information
 */

// Dependencies
const mediaFilesHelper = require(MODULES_BASE_PATH + "/mediaFiles/helper");


/**
    * MediaFiles
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
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/createEmoji
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "smiley",
     *  "type": "emoji"
     * }
     * @apiParam {File} image file.
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Emoji created successfully"
     *}
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Emoji.
    * @method
    * @name createEmoji
    * @param {Object} req -request Data.
    * @param {File} req.files - requested files
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
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/createGesture
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "thumbsUp",
     *  "type": "gesture"
     * }
     * @apiParam {File} image file.
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Gesture created successfully"
     *}
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Gesture.
    * @method
    * @name createGesture
    * @param {Object} req -request Data.
    * @returns {String} - message .
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
     * @api {post} /assessment/api/v1/mediaFiles/getGesture Get Gesture
     * @apiVersion 1.0.0
     * @apiName Get Gesture
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getGesture
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "thumbsUp"
     * }
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Gesture fetched successfully",
     *  "result" : [{
     *      "name": "thumbsUp",
            "type": "gesture",
            "url": "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2Fdrafts.png?generation=1593680944065555&alt=media",
         }]
     * }
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
     * @api {post} /assessment/api/v1/mediaFiles/getEmoji Get Emoji
     * @apiVersion 1.0.0
     * @apiName Get Emoji
     * @apiGroup MediaFiles
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/mediaFiles/getEmoji
     * @apiParamExample {json} Request-Body:
     * {
     *  "name": "smiley"
     * }
     * @apiParamExample {json} Response:
      * {
     *  "status": 200,
     *  "message": "Emoji fetched successfully",
     *  "result" : [{
           "name": "smiley",
            "type": "emoji",
            "url": "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2Fdrafts.png?generation=1593680944065555&alt=media",
         }]
     * }
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
