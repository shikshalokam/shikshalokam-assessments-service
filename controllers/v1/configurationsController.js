/**
 * name : configurationsController.js
 * author : Akash
 * created-date : 22-Nov-2018
 * Description : App configurations.
 */

 /**
    * Configurations
    * @class
*/
module.exports = class Configurations extends Abstract {
    constructor() {
        super(configurationsSchema);
    }

    static get name() {
        return "configurations";
    }

    /**
    * @api {get} /assessment/api/v1/configurations/navigation Navigation configurations
    * @apiVersion 1.0.0
    * @apiName Navigation configurations
    * @apiGroup Configurations
    * @apiSampleRequest /assessment/api/v1/configurations/navigation
    * @apiUse successBody
    * @apiUse errorBody
    * @apiParamExample {json} Response:
    * "tabActions": [
    * {
        "name": "Configuration",
        "id": "configuration",
        "accessibility": true,
        "tabActions": [
            {
            "name": "Criteria",
            "id": "criteria",
            "accessibility": true,
            "tabActions": []
            },
            {
            "name": "Question",
            "id": "question",
            "accessibility": false,
            "tabActions": []
            }
        ]
    * }
    ]
    */

      /**
      * App navigation links.
      * @method
      * @name navigation
      * @param {Object} req - All requested Data.
      * @param {Array} req.userDetails.allRoles - Array of loggedin useer roles
      * @returns {JSON} returns a navigation action required for samiksha app.
     */

    async navigation(req) {
        return new Promise(async (resolve, reject) => {
            try {
                _.pull(req.userDetails.allRoles, 'PUBLIC');
                const userRole = req.userDetails.allRoles[0];
                if (!userRole) {
                    return resolve({
                        status: 400,
                        message: "Bad request."
                    });
                }
                let tabControlsDocument = await database.models.configurations.findOne({ name: 'navigation' }).lean();
                if (!tabControlsDocument) {
                    return resolve({
                        status: 400,
                        message: "No configurations available for given params."
                    });
                }
                return resolve({
                    message: "Configurations fetched successfully.",
                    result: tabControlsDocument.result.tabGroups[userRole] ? tabControlsDocument.result.tabGroups[userRole] : tabControlsDocument.result.tabGroups["DEFAULT"]
                });
            } catch (error) {
                return reject({
                    status: 500,
                    message: error,
                    errorObject: error
                });
            }
        })
    }

};
