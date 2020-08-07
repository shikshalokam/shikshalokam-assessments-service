/**
 * name : pollsController.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Polls information
 */

// Dependencies
const pollsHelper = require(MODULES_BASE_PATH + "/polls/helper");


/**
    * Polls
    * @class
*/
module.exports = class Polls extends Abstract {

    constructor() {
        super(pollsSchema);
    }

    static get name() {
        return "polls";
    }

     /**
    * @api {get} /assessment/api/v1/polls/metaForm Poll Creation Meta Form
    * @apiVersion 1.0.0
    * @apiName Poll Creation Meta Form
    * @apiGroup Polls
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiSampleRequest /assessment/api/v1/polls/metaForm
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * {
    * "staus": 200,
    * "message": "Form fetched successfully",
    * "result": [
       {
        field: "name",
        label: "Name of the Poll",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "creator",
        label: "Name of the Creator",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "text"
      },
      {
        field: "organisations",
        label: "Name of the Organization",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "radio",
        options: [
          {
            value: "12345",
            label: "Shikshalokam"
          },
          {
            value: "24367",
            label: "Mantra"
          }
        ]

      },
      {
        field: "startDate",
        label: "startDate",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "date",
        dateformat: "DD-MM-YYYY"
      },
      {
        field: "endDate",
        label: "endDate",
        value: "",
        visible: true,
        editable: true,
        validation: {
          required: true
        },
        input: "date",
        dateformat: "DD-MM-YYYY"
      },
       {
        field : "responseType",
        label : "Choose response type",
        value : "",
        visible : true,
        editable : true,
        validation : {
          required : true
        },
        input : "radio",
              options : [
          {
            value : "radio",
            label : "Single select"
          },
          {
            value : "mutlselect",
            label : "Multiselect"
          },
          {
            value : "emoji",
            label : "Emoji"
          },
          {
            value : "gestures",
            label : "Gestures"
          }
        ]
  
      },
      {
        field : "question",
        label : "Question",
        value : "",
        visible : true,
        editable : true,
        validation : {
          required : true
        },
        input : "text"
      },
      {
        field : "options",
        label : "Options",
        value : "",
        visible : false,
        editable : true,
        validation : {
          required : true
        },
        input : "multiselect"
      },
      {
        field : "text-option",
        label : "Text option",
        value : "",
        visible : false,
        editable : true,
        validation : {
        required : true,
          visibleIf : {
            value : "radio||multiselect",
            operator : "===",
            _id : "responseType"
          }
            
        },
        input : "multiselect"
      },
          {
         field : "emoji-option",
         label : "Emoji option",
         value : "",
         visible : false,
         editable : true,
         validation : {
         required : true,
            visibleIf : {
                value : "emoji",
                operator : "===",
                _id : "responseType"
            }
        },
        input : "emojis"
      },
          {
         field : "gesture-option",
         label : "Gesture option",
         value : "",
         visible : false,
         editable : true,
         validation : {
         required : true,
            visibleIf : {
                value : "gestures",
                operator : "===",
                _id : "responseType"
            }
        },
        input : "gestures"
      }
    ]
    }
    */

     /**
   * Poll Creation Meta Form
   * @method
   * @name metaForm
   * @param {Object} req -request Data.
   * @returns {JSON} - Poll Creation Meta Form.
   */

   async metaForm(req) {

    return new Promise(async (resolve, reject) => {

        try {

            let pollCreationForm = 
            await pollsHelper.metaForm();

            return resolve(pollCreationForm);

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
     * @api {post} /assessment/api/v1/polls/create Create Poll
     * @apiVersion 1.0.0
     * @apiName Create Poll
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/create
     * @apiParamExample {json} Request-Body:
     * {
     *   "pollName": "",
         "questions": [{
             "qid": ""
             "question": "",
             "responseType": "",
             "options": [] 
         }],
         "organisationName": ""
     * }
     * @apiParamExample {json} Response:
     * { 
     *  "status": 200,
     *  "message": "Poll created successfully"
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Create Poll
    * @method
    * @name create
    * @param {Object} req - request Data. 
    * @param req.body - poll creation  object
    * @returns {String} - message.
    */

   create(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await pollsHelper.create(
               req.body,
               req.userDetails.userId
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
     * @api {get} /assessment/api/v1/polls/list List active polls
     * @apiVersion 1.0.0
     * @apiName List active polls
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/list
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Polls list fetched successfully",
     *  "result": [{
     *      "pollName": "",
            "creator": "",
            "questions": [{
               "qid": "",
               "question": "",
               "responseType": "",
               "options": [] 
            }],
            "organisationName": "",
            "createdAt": "",
            "updatedAt": "",
            "numberOfResponses": "",
            "isDeleted": false,
            "startDate": "",
            "endDate": "",
            "status": "active"
     *     }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * List active polls.
    * @method
    * @name list
    * @param {Object} req -request Data. 
    * @returns {JSON} - active polls list.
    */

   list(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let pollsList = await pollsHelper.list(
            );

            return resolve(pollsList);

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
     * @api {get} /assessment/api/v1/polls/delete/:pollId Delete an poll
     * @apiVersion 1.0.0
     * @apiName Delete an poll
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/delete/5b98fa069f664f7e1ae7498c
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll deleted successfully"
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Delete poll.
    * @method
    * @name delete
    * @param {Object} req -request Data.
    * @param {String} req.params._id - pollId.  
    * @returns {String} - message
    */

   delete(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await pollsHelper.delete(
                req.params._id
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
     * @api {get} /assessment/api/v1/polls/getpollQuestions/:pollId Get the poll questions
     * @apiVersion 1.0.0
     * @apiName Get the poll questions
     * @apiGroup Polls
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiSampleRequest /assessment/api/v1/polls/getpollQuestions/5f2bcc04456a2a770c4a5f3b
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Poll questions fetched successfully",
     *  "result": [{
     *      "qid": "",
     *      "question": "",
     *      "responseType": "",
     *      "options": [] 
     * }]
     * }
     * @apiUse successBody
     * @apiUse errorBody
     */
     
    /**
    * Get the poll questions
    * @method
    * @name getpollQuestions
    * @param {Object} req -request Data.
    * @param {String} req.params._id - pollId.  
    * @returns {JSON} - poll questions and options
    */

   getpollQuestions(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let pollQuestions = await pollsHelper.getpollQuestions(
                req.params._id
            );

            return resolve(pollQuestions);

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
