/**
 * name : programs/helper.js
 * author : Akash
 * created-date : 20-Jan-2019
 * Description : Programs helper functionality
 */

/**
    * ProgramsHelper
    * @class
*/
module.exports = class ProgramsHelper {

    /**
   * Programs list.
   * @method
   * @name list
   * @param {Array} [filterQuery = "all"] - filter query data.
   * @param {Array} [fields = "all"] - projected data
   * @param {Array} [skipFields = "none"] - fields to skip
   * @returns {JSON} - Programs list.
   */

  static list(filterQuery = "all" , fields = "all", skipFields = "none") {
    return new Promise(async (resolve, reject) => {
      try {

        let filteredData = {};

        if( filterQuery !== "all" ) {
          filteredData = filterQuery;
        }

        let projection = {};

        if (fields != "all") {
          fields.forEach(element => {
            projection[element] = 1;
          });
        }

        if (skipFields != "none") {
          
          skipFields.forEach(element => {
            projection[element] = 0;
          });
        }
        
        const programs = 
        await database.models.programs.find(
          filteredData, 
          projection
        ).lean();

        return resolve(programs);

      } catch(error) {
        return reject(error);
      }
    })
  }

   /**
   * List of programs.
   * @method
   * @name programDocument
   * @param {Array} [programIds = "all"] - list of programIds.
   * @param {Array} [fields = "all"] -projected data
   * @param {Array} [pageIndex = "all"] - all page index.
   * @param {Array} [pageSize = "all"] - page limit.
   * @returns {JSON} - program document list.
   */

  static programDocument(programIds = "all", fields = "all", pageIndex = "all", pageSize = "all") {

    return new Promise(async (resolve, reject) => {

      try {

        let queryObject = {};

        if (programIds != "all") {
          queryObject = {
            _id: {
              $in: programIds
            }
          };
        }

        let projectionObject = {};

        if (fields != "all") {
          fields.forEach(element => {
            projectionObject[element] = 1;
          });
        }

        let pageIndexValue = 0;
        let limitingValue = 0;

        if (pageIndex != "all" && pageSize !== "all") {
          pageIndexValue = (pageIndex - 1) * pageSize;
          limitingValue = pageSize;
        }

        let programDocuments = await database.models.programs.find(queryObject, projectionObject).skip(pageIndexValue).limit(limitingValue);

        return resolve(programDocuments);

      } catch (error) {

        return reject(error);

      }

    })
  }
};