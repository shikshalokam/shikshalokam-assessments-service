/**
 * name : polls/helper.js
 * author : Deepa
 * created-date : 01-Aug-2020
 * Description : Polls helper functionality.
 */

// Dependencies

/**
    * PollsHelper
    * @class
*/
module.exports = class PollsHelper {

    /**
     * Poll Creation meta form
     * @method
     * @name metaForm
     * @returns {JSON} - Form details
     */

    static metaForm() {
        return new Promise(async (resolve, reject) => {
            try {

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_CREATION_FORM_FETCHED,
                    data: [
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
                            field: "responseType",
                            label: "Choose response type",
                            value: "",
                            visible: true,
                            editable: true,
                            validation: {
                                required: true
                            },
                            input: "radio",
                            options: [
                                {
                                    value: "radio",
                                    label: "Single select"
                                },
                                {
                                    value: "mutlselect",
                                    label: "Multiselect"
                                },
                                {
                                    value: "emoji",
                                    label: "Emoji"
                                },
                                {
                                    value: "gestures",
                                    label: "Gestures"
                                }
                            ]

                        },
                        {
                            field: "question",
                            label: "Question",
                            value: "",
                            visible: true,
                            editable: true,
                            validation: {
                                required: true
                            },
                            input: "text"
                        },
                        {
                            field: "options",
                            label: "Options",
                            value: "",
                            visible: false,
                            editable: true,
                            validation: {
                                required: true
                            },
                            input: "multiselect"
                        },
                        {
                            field: "text-option",
                            label: "Text option",
                            value: "",
                            visible: false,
                            editable: true,
                            validation: {
                                required: true,
                                visibleIf: {
                                    value: "radio||multiselect",
                                    operator: "===",
                                    _id: "responseType"
                                }

                            },
                            input: "multiselect"
                        },
                        {
                            field: "emoji-option",
                            label: "Emoji option",
                            value: "",
                            visible: false,
                            editable: true,
                            validation: {
                                required: true,
                                visibleIf: {
                                    value: "emoji",
                                    operator: "===",
                                    _id: "responseType"
                                }
                            },
                            input: "emojis"
                        },
                        {
                            field: "gesture-option",
                            label: "Gesture option",
                            value: "",
                            visible: false,
                            editable: true,
                            validation: {
                                required: true,
                                visibleIf: {
                                    value: "gestures",
                                    operator: "===",
                                    _id: "responseType"
                                }
                            },
                            input: "gestures"
                        }
                    ]
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
     * @returns {String} - message.
     */

    static create(pollData= {}, userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_CREATED,
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
    * List all the polls.
    * @method
    * @name list
    * @param {String} userId - userId
    * @returns {JSON} - Polls list.
    */

    static list(userId= "") {
        return new Promise(async (resolve, reject) => {
            try {

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLLS_LIST_FETCHED,
                    data: [{
                        pollName: "meeting fedback",
                        creator: "",
                        questions: [{
                            qid: "5ee745fa7e29794d385eb8b5",
                            question: "did you like the meeting?",
                            responseType: "radio",
                            options: ["yes", "no"]
                        }],
                        organisationName: "Shikshalokam",
                        createdAt: "2020-03-26T15:43:54+05:30",
                        updatedAt: "2020-03-26T15:43:54+05:30",
                        numberOfResponses: "2",
                        isDeleted: false,
                        startDate: "2020-03-26T15:43:54+05:30",
                        endDate: "2020-04-26T15:43:54+05:30",
                        status: "active"
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
     * Delete an poll.
     * @method
     * @name delete
     * @param {String} pollId - pollId 
     * @returns {String} - message.
     */

    static delete(pollId= "") {
        return new Promise(async (resolve, reject) => {
            try {

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

                return resolve({
                    success: true,
                    message: messageConstants.apiResponses.POLL_DELETED,
                    data: [{
                        qid: "",
                        question: "",
                        responseType: "",
                        options: [] 
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
