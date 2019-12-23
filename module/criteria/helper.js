/**
 * name :criteria/helper.js
 * author : Aman Jung Karki
 * created-date : 18-Dec-2019
 * Description : All criteria apis helper functions
 */


/**
 * Dependencies 
 */

const dataSetUploadRequestsHelper = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");

const filesHelper = 
require(MODULES_BASE_PATH + "/files/helper");

/**
    * criteriaHelper
    * @class
*/

module.exports = class criteriaHelper {

    /**
      * Upload criteria from csv.
      * @method
      * @name upload
      * @param {Object []} criteriaData - array of criterias.
      * @param  {String} userId - Logged in user id. 
      * @returns {Promise} returns a promise.  
    */

    static upload(criteriaData,userId,requestId) {
        return new Promise(async (resolve, reject) => {
            try {

                let getCsvFile = await filesHelper.csvFile("upload-criteria");
                let input = getCsvFile.input;
                let criteriaDataSize = criteriaData.length;
                let criteriaStructure = this._defaultCriteriaStructure();
                criteriaStructure["owner"] = userId;
                let countOfRecordUploaded = 0;
                
                // await Promise.all(criteriaData.map(async criteria => {
                for(let pointerToCriteria = 0;
                    pointerToCriteria < criteriaData.length;
                    pointerToCriteria++
                ) {
                    let criteria = criteriaData[pointerToCriteria];
                    let csvData = {};
                    let parsedCriteria = gen.utils.valueParser(criteria);
                    let criteriaRubric = this._criteriaRubric(parsedCriteria);

                    criteriaStructure["name"] = parsedCriteria.criteriaName;
                    criteriaStructure["description"] = parsedCriteria.criteriaName;

                    criteriaStructure["rubric"] = criteriaRubric;
                    criteriaStructure["externalId"] = criteria.criteriaID;

                    csvData["Criteria Name"] = parsedCriteria.criteriaName;
                    csvData["Criteria External Id"] = parsedCriteria.criteriaID;
        
                    let criteriaDocuments = await database.models.criteria.create(
                     criteriaStructure
                    );

                    if (criteriaDocuments._id) {
                      csvData["Criteria Internal Id"] = criteriaDocuments._id;
                      countOfRecordUploaded += 1;
                   
                      await dataSetUploadRequestsHelper.updateUploadedCsvData(
                         criteriaDataSize,
                         requestId,
                         getCsvFile.filePathUrl,
                         countOfRecordUploaded
                     );

                   } else {
                     csvData["Criteria Internal Id"] = "Not inserted"
                   }

                   input.push(csvData);
                }
        
                input.push(null);
                
            } catch (error) {
                return reject(error);
            }
        });
    }

    static setCriteriaRubricExpressions(criteriaId, existingCriteria, criteriaRubricData) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let expressionVariables = {}
                let expressionVariablesArray = criteriaRubricData.expressionVariables.split("###")
                
                expressionVariablesArray.forEach(expressionVariable => {
                    let tempExpressionVariableArray = expressionVariable.split("=")
                    let expressionVariableArray = new Array
                    expressionVariableArray.push(tempExpressionVariableArray.shift())
                    expressionVariableArray.push(tempExpressionVariableArray.join('='))
                    let defaultVariableArray = expressionVariableArray[0].split("-")
                    if (defaultVariableArray.length > 1) {
                        if (!expressionVariables.default) expressionVariables.default = {};
                        expressionVariables.default[defaultVariableArray[0]] = expressionVariableArray[1]
                    } else {
                        expressionVariables[expressionVariableArray[0]] = expressionVariableArray[1]
                    }
                })

                let rubric = {
                    name: existingCriteria.name,
                    description: existingCriteria.description,
                    type: existingCriteria.criteriaType,
                    expressionVariables: expressionVariables,
                    levels: {}
                }

                let existingCriteriaRubricLevels

                if (Array.isArray(existingCriteria.rubric.levels)) {
                    existingCriteriaRubricLevels = existingCriteria.rubric.levels
                } else {
                    existingCriteriaRubricLevels = Object.values(existingCriteria.rubric.levels)
                }

                existingCriteriaRubricLevels.forEach(levelObject => {
                    rubric.levels[levelObject.level] = {
                        level: levelObject.level,
                        label: levelObject.label,
                        description: levelObject.description,
                        expression: criteriaRubricData[levelObject.level]
                    }
                })

                 await database.models.criteria.findOneAndUpdate(
                    {_id : criteriaId},
                    {
                        rubric: rubric,
                        criteriaType : "auto"
                    }
                );

                return resolve({
                    success: true,
                    message : "Criteria rubric updated successfully."
                });

            } catch (error) {
                return reject(error);
            }
        })

    }

    static criteriaDocument(criteriaFilter = "all", fieldsArray = "all") {
        return new Promise(async (resolve, reject) => {
            try {
        
                let queryObject = (criteriaFilter != "all") ? criteriaFilter : {};
        
        
                let projectionObject = {}
        
                if (fieldsArray != "all") {
                    fieldsArray.forEach(field => {
                        projectionObject[field] = 1;
                    });
                }
        
                let questionDocuments = await database.models.criteria.find(queryObject, projectionObject).lean();
                
                return resolve(questionDocuments);
                
            } catch (error) {
                return reject(error);
            }
        });
    }

    static _defaultCriteriaStructure() {
        return {
            resourceType: [
             process.env.DEFAULT_RESOURCE_TYPE1,
             process.env.DEFAULT_RESOURCE_TYPE2,
             process.env.DEFAULT_RESOURCE_TYPE3
            ],
            language: [
              process.env.DEFAULT_LANGUAGE
            ],
            keywords: [
              process.env.DEFAULT_KEYWORD1,
              process.env.DEFAULT_KEYWORD2
            ],
            concepts: [
              {
                identifier: process.env.DEFAULT_IDENTIFIER1,
                name: process.env.DEFAULT_NAME1,
                objectType: process.env.DEFAULT_OBJECT_TYPE,
                relation: process.env.DEFAULT_RELATION,
                description: null,
                index: null,
                status: null,
                depth: null,
                mimeType: null,
                visibility: null,
                compatibilityLevel: null
              },
              {
                identifier: process.env.DEFAULT_IDENTIFIER2,
                name: process.env.DEFAULT_NAME2,
                objectType: process.env.DEFAULT_OBJECT_TYPE,
                relation: process.env.DEFAULT_RELATION,
                description: null,
                index: null,
                status: null,
                depth: null,
                mimeType: null,
                visibility: null,
                compatibilityLevel: null
              },
              {
                identifier: process.env.DEFAULT_IDENTIFIER3,
                name: process.env.DEFAULT_NAME3,
                objectType: process.env.DEFAULT_OBJECT_TYPE,
                relation: process.env.DEFAULT_RELATION,
                description: null,
                index: null,
                status: null,
                depth: null,
                mimeType: null,
                visibility: null,
                compatibilityLevel: null
              }
            ],
            createdFor: [
              process.env.CRITERIA_CREATED_FOR_1,
              process.env.CRITERIA_CREATED_FOR_2
            ],
            evidences: [],
            deleted: process.env.DELETED_FALSE,
            timesUsed: process.env.DEFAULT_TIME_USED,
            weightage: process.env.DEFAULT_CRITERIA_WEIGHT_AGE,
            remarks: process.env.DEFAULT_REMARKS_FOR_CRITERIA,
            criteriaType: process.env.DEFAULT_CRITERIA_TYPE,
            score: process.env.DEFAULT_CRITERIA_SCORE,
            flag: process.env.DEFAULT_CRITERIA_FLAG
        };
    }

    static _criteriaRubric(criteria) {
        let rubric = {};
        rubric.name = criteria.criteriaName;
        rubric.description = criteria.criteriaName;
        rubric.type = criteria.type;
        rubric.expressionVariables = {};
        rubric.levels = {};
        let countLabel = 1;

        Object.keys(criteria).forEach(eachCriteriaKey => {

          let regExpForLevels = /^L+[0-9]/;
          if (regExpForLevels.test(eachCriteriaKey)) {

            let label = "Level " + countLabel++;

            rubric.levels[eachCriteriaKey] = {
              level: eachCriteriaKey,
              label: label,
              description: criteria[eachCriteriaKey],
              expression: ""
            };
          }
        })

        return rubric;
    }

};

