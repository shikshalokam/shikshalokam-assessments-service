/**
 * name : reportsController.js
 * author : Aman
 * created-date : 22-Dec-2018
 * Description : Reports related information.
 */

// Dependencies
let moment = require("moment");
const filesHelper = require(MODULES_BASE_PATH + "/files/helper");

/**
    * ReportsHelper
    * @class
*/
module.exports = class ReportsHelper {

    /**
   * Convert gmt to ist.
   * @method
   * @name gmtToIst
   * @param {TimeRanges} gmtTime - gmtTime
   * @returns {TimeRanges} - converted gmtTime to ist
   */

    static gmtToIst(gmtTime) {
        try {

            let istStart = moment(gmtTime)
                .tz("Asia/Kolkata")
                .format("YYYY-MM-DD HH:mm:ss");

            if (istStart == "Invalid date") {
                istStart = "-";
            }

            return istStart;

        } catch (error) {
            return error;
        }

    }

  /**
   * Convert gmt to ist.
   * @method
   * @name getFilePublicBaseUrl
   * @returns {String} - public base url
   */

    static getFilePublicBaseUrl() {
        return new Promise(async (resolve, reject) => {
            try {

            const url = filesHelper.getFilePublicBaseUrl();

            return resolve(url);

            } catch (error) {
                return reject(error);
            }
        })
    }

};