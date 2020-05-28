/**
 * name : solutions/helper.js
 * author : Akash
 * created-date : 22-feb-2019
 * Description : Solution related helper functionality.
 */

//Dependencies
const observationsHelper = require(MODULES_BASE_PATH + "/observations/helper");
const entityAssessorsHelper = require(MODULES_BASE_PATH + "/entityAssessors/helper");
const programsHelper = require(MODULES_BASE_PATH + "/programs/helper");
const criteriaHelper = require(MODULES_BASE_PATH + "/criteria/helper");
const questionsHelper = require(MODULES_BASE_PATH + "/questions/helper");

/**
    * SolutionsHelper
    * @class
*/
module.exports = class SolutionsHelper {

    /**
   * find solutions
   * @method
   * @name details
   * @param {Array} [solutionIds = "all"] - solution ids.
   * @param {Array} [fields = "all"] - projected fields.
   * @returns {Array} List of solutions. 
   */
  
  static solutionDocuments(
    solutionFilter = "all", 
    fieldsArray = "all",
    skipFields = "none"
  ) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let queryObject = (solutionFilter != "all") ? solutionFilter : {};
    
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
    
            let solutionDocuments = 
            await database.models.solutions.find(
              queryObject, 
              projection
            ).lean();
            
            return resolve(solutionDocuments);
            
        } catch (error) {
            return reject(error);
        }
    });
  }

   /**
   * Create solution.
   * @method create
   * @name details
   * @param {Object} data - solution creation data.
   * @returns {JSON} solution creation data. 
   */
  
  static create(data) {
    return new Promise(async (resolve, reject) => {
        try {
    
            let solutionData = 
            await database.models.solutions.create(
              data
            );
            
            return resolve(solutionData);
            
        } catch (error) {
            return reject(error);
        }
    });
  }

    /**
   * Check if the solution is rubric driven i.e isRubricDriven flag as true is present
   * in solution or not 
   * @method
   * @name checkIfSolutionIsRubricDriven
   * @param {String} solutionId - solution id.
   * @returns {JSON} Solution document. 
   */

  static checkIfSolutionIsRubricDriven(solutionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let solutionDocument = await database.models.solutions
          .find(
            {
              _id: solutionId,
              scoringSystem: {
                $exists: true,
                $ne: ""
              },
              isRubricDriven : true
            },
            {
              scoringSystem: 1
            }
          )
          .lean();

        return resolve(solutionDocument);
      } catch (error) {
        return reject(error);
      }
    });
  }

   /**
   * Get entity profile fields from solution. 
   * @method
   * @name getEntityProfileFields
   * @param {Object} entityProfileFieldsPerEntityTypes - entity profile fields
   * from solution.
   * @returns {Array} entity fields. 
   */

  static getEntityProfileFields(entityProfileFieldsPerEntityTypes) {
    let entityFieldArray = [];

    Object.values(entityProfileFieldsPerEntityTypes).forEach(
      eachEntityProfileFieldPerEntityType => {
        eachEntityProfileFieldPerEntityType.forEach(eachEntityField => {
          entityFieldArray.push(eachEntityField);
        });
      }
    );
    return entityFieldArray;
  }

   /**
   * Get all sub entity that exists in single parent entity. 
   * @method
   * @name allSubGroupEntityIdsByGroupName
   * @param {String} [solutionExternalId = ""] - solution external id.
   * @param {String} [groupName = ""] - entity type name.
   * @returns {Object} all subEntity present in single parent entity . 
   */

  static allSubGroupEntityIdsByGroupName(solutionExternalId = "", groupName = "") {
    return new Promise(async (resolve, reject) => {
      try {
        if (solutionExternalId == "" || groupName == "") {
          throw messageConstants.apiResponses.INVALID_PARAMETER;
        }

        let solutionEntities = await database.models.solutions.findOne(
          {
            externalId: solutionExternalId
          },
          {
            entities: 1
          }
        );

        let allSubGroupEntityIdToParentMap = {};

        if (!(solutionEntities.entities.length > 0)) {
          return resolve(allSubGroupEntityIdToParentMap);
        }

        let groupType = "groups." + groupName;

        let entitiyDocuments = await database.models.entities
          .find(
            {
              _id: {
                $in: solutionEntities.entities
              },
              [groupType]: { $exists: true }
            },
            {
              "metaInformation.name": 1,
              "metaInformation.externalId": 1,
              [groupType]: 1
            }
          )
          .lean();

        entitiyDocuments.forEach(entityDocument => {
          entityDocument.groups[groupName].forEach(eachSubEntity => {
            allSubGroupEntityIdToParentMap[eachSubEntity.toString()] = {
              parentEntityId: eachSubEntity._id.toString(), 
              // parentEntityId: should be entityDocuments._id
              parentEntityName: entityDocument.metaInformation.name
                ? entityDocument.metaInformation.name
                : "",
              parentEntityExternalId: entityDocument.metaInformation.externalId
                ? entityDocument.metaInformation.externalId
                : ""
            };
          });
        });

        return resolve(allSubGroupEntityIdToParentMap);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static uploadTheme(modelName, modelId, themes, headerSequence) {
    return new Promise(async (resolve, reject) => {
      try {

        let allCriteriaDocument = await database.models.criteria.find(
          {},
          { _id: 1 }
        ).lean();

        let criteriaArray = allCriteriaDocument.map(eachCriteria => eachCriteria._id.toString());

        let modifiedThemes = [];
        let themeObject = {};
        let csvArray = [];


        // get Array of object with splitted value
        for (let pointerToTheme = 0; pointerToTheme < themes.length; pointerToTheme++) {

          let result = {};
          let csvObject = {};

          csvObject = { ...themes[pointerToTheme] };
          csvObject["status"] = "";
          let themesKey = Object.keys(themes[pointerToTheme]);
          let firstThemeKey = themesKey[0];

          themesKey.forEach(themeKey => {

            if (themes[pointerToTheme][themeKey] !== "") {

              let themesSplittedArray = themes[pointerToTheme][themeKey].split("###");


              if (themeKey !== "criteriaInternalId") {
                if (themesSplittedArray.length < 2) {
                  csvObject["status"] = messageConstants.apiResponses.MISSING_NAME_EXTERNALID;

                } else {
                  let name = themesSplittedArray[0] ? themesSplittedArray[0] : "";

                  result[themeKey] = {
                    name: name
                  };

                  themeObject[themesSplittedArray[0]] = {
                    name: name,
                    label: themeKey,
                    type: firstThemeKey === themeKey ? "theme" : "subtheme",
                    externalId: themesSplittedArray[1],
                    weightage: themesSplittedArray[2] ? parseInt(themesSplittedArray[2]) : 0
                  };
                }
              } else {

                if (criteriaArray.includes(themesSplittedArray[0])) {
                  result[themeKey] = {
                    criteriaId: ObjectId(themesSplittedArray[0]),
                    weightage: themesSplittedArray[1] ? parseInt(themesSplittedArray[1]) : 0,
                  };
                } else {
                  csvObject["status"] = "Criteria is not Present";

                }

              }

            }
          })
          csvArray.push(csvObject);
          modifiedThemes.push(result);
        }

        function generateNestedThemes(nestedThemes, headerData) {
          return nestedThemes.reduce((acc, eachFrameworkData) => {
            headerData.reduce((parent, headerKey, index) => {
              if (index === headerData.length - 1) {
                if (!parent["criteriaId"]) {
                  parent["criteriaId"] = []
                };
                parent.criteriaId.push(eachFrameworkData.criteriaInternalId);

              } else {
                if (eachFrameworkData[headerKey] !== undefined) {
                  parent[eachFrameworkData[headerKey].name] = parent[eachFrameworkData[headerKey].name] ||
                    {};
                  return parent[eachFrameworkData[headerKey].name];
                } else {
                  return parent;
                }
              }

            }, acc);
            return acc;
          }, {});
        }

        function themeArray(data) {

          return Object.keys(data).map(function (eachDataKey) {
            let eachData = {};

            if (eachDataKey !== "criteriaId") {
              eachData["name"] = themeObject[eachDataKey].name;
              eachData["type"] = themeObject[eachDataKey].type;
              eachData["label"] = themeObject[eachDataKey].label;
              eachData["externalId"] = themeObject[eachDataKey].externalId;
              eachData["weightage"] = themeObject[eachDataKey].weightage;
            }

            if (data[eachDataKey].criteriaId) eachData["criteria"] = data[eachDataKey].criteriaId;
            if (eachDataKey !== "criteriaId" && _.isObject(data[eachDataKey])) {
              return _.merge(eachData, data[eachDataKey].criteriaId ? {} : { children: themeArray(data[eachDataKey]) });
            }
          });
        }

        let checkCsvArray = csvArray.every(csvData => csvData.status === "");

        if (checkCsvArray) {

          csvArray = csvArray.map(csvData => {
            csvData.status = "success"
            return csvData
          });

          let nestedThemeObject = generateNestedThemes(modifiedThemes, headerSequence);

          let themesData = themeArray(nestedThemeObject);

          await database.models[modelName].findOneAndUpdate({
            _id: modelId
          }, {
              $set: {
                themes: themesData
              }
            });
        }

        return resolve(csvArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

   /**
   * Set theme rubric expression. 
   * @method
   * @name setThemeRubricExpressions
   * @param {Object} currentSolutionThemeStructure
   * @param {Object} themeRubricExpressionData
   * @param {Array} solutionLevelKeys
   * @returns {Object} 
   */

  static setThemeRubricExpressions(currentSolutionThemeStructure, themeRubricExpressionData, solutionLevelKeys) {
    return new Promise(async (resolve, reject) => {
      try {

        themeRubricExpressionData = themeRubricExpressionData.map(function(themeRow) {
          themeRow = gen.utils.valueParser(themeRow);
          themeRow.status = messageConstants.apiResponses.THEME_SUBTHEME_FAILED;
          return themeRow;
        })

        const getThemeExpressions = function (externalId, name) {
          return _.find(themeRubricExpressionData, { 'externalId': externalId, 'name': name });
        }


        const updateThemeRubricExpressionData = function (themeRow) {
          
          const themeIndex = themeRubricExpressionData.findIndex(row => row.externalId === themeRow.externalId && row.name === themeRow.name);

          if(themeIndex >= 0) {
            themeRubricExpressionData[themeIndex] = themeRow;
          }

        }

        const parseAllThemes = function (themes) {

          themes.forEach(theme => {

            const checkIfThemeIsToBeUpdated = getThemeExpressions(theme.externalId, theme.name);
            
            if(checkIfThemeIsToBeUpdated) {
              
              theme.rubric = {
                expressionVariables : {
                  SCORE : `${theme.externalId}.sumOfPointsOfAllChildren()`
                },
                levels : {}
              };
              solutionLevelKeys.forEach(level => {
                theme.rubric.levels[level] = {expression : `(${checkIfThemeIsToBeUpdated[level]})`};
              })
              
              theme.weightage = (checkIfThemeIsToBeUpdated.hasOwnProperty('weightage')) ? Number(Number.parseFloat(checkIfThemeIsToBeUpdated.weightage).toFixed(2)) : 0;

              checkIfThemeIsToBeUpdated.status = "Success";

              updateThemeRubricExpressionData(checkIfThemeIsToBeUpdated);
            } 
            // else if(!theme.criteria) {
            //   let someRandomValue = themeRubricExpressionData[Math.floor(Math.random()*themeRubricExpressionData.length)];

            //   theme.rubric = {
            //     expressionVariables : {
            //       SCORE : `${theme.externalId}.sumOfPointsOfAllChildren()`
            //     },
            //     levels : {}
            //   }
            //   solutionLevelKeys.forEach(level => {
            //     theme.rubric.levels[level] = {expression: `(${someRandomValue[level]})`}
            //   })

            //   theme.weightage = (someRandomValue.hasOwnProperty('weightage')) ? Number(Number.parseFloat(someRandomValue.weightage).toFixed(2)) : 0

            // }

            if(theme.children && theme.children.length >0) {
              parseAllThemes(theme.children);
            }

          })

        }
        
        parseAllThemes(currentSolutionThemeStructure);

        const flatThemes = await this.generateFlatThemeRubricStructure(currentSolutionThemeStructure);

        return resolve({
          themes: currentSolutionThemeStructure,
          csvData : themeRubricExpressionData,
          flattenedThemes : flatThemes
        });

      } catch (error) {
        return reject(error);
      }
    });
  }

   /**
   * Update criteria weightage in themes. 
   * @method
   * @name updateCriteriaWeightageInThemes
   * @param {Object} currentSolutionThemeStructure
   * @param {Array} criteriaWeightageArray
   * @returns {Object} 
   */

  static updateCriteriaWeightageInThemes(currentSolutionThemeStructure, criteriaWeightageArray) {
    return new Promise(async (resolve, reject) => {
      try {

        criteriaWeightageArray = criteriaWeightageArray.map(function(criteria) {
          criteria.criteriaId = criteria.criteriaId.toString();
          return criteria;
        })

        const cirteriaWeightToUpdateCount = criteriaWeightageArray.length;

        let criteriaWeightageUpdatedCount = 0;

        const getCriteriaWeightElement = function (criteriaId) {
          return _.find(criteriaWeightageArray, { 'criteriaId': criteriaId.toString()});
        }

        const parseAllThemes = function (themes) {

          themes.forEach(theme => {

            if(theme.criteria && theme.criteria.length > 0) {
              for (let pointerToCriteriaArray = 0; pointerToCriteriaArray < theme.criteria.length; pointerToCriteriaArray ++) {
                let eachCriteria = theme.criteria[pointerToCriteriaArray];
                const checkIfCriteriaIsToBeUpdated = getCriteriaWeightElement(eachCriteria.criteriaId);
                if(checkIfCriteriaIsToBeUpdated) {
                  theme.criteria[pointerToCriteriaArray] = {
                    criteriaId : ObjectId(checkIfCriteriaIsToBeUpdated.criteriaId),
                    weightage : Number(Number.parseFloat(checkIfCriteriaIsToBeUpdated.weightage).toFixed(2))
                  };
                  criteriaWeightageUpdatedCount += 1;
                }
              }
            }

            if(theme.children && theme.children.length > 0) {
              parseAllThemes(theme.children);
            }

          })

        }
        
        parseAllThemes(currentSolutionThemeStructure);

        const flatThemes = await this.generateFlatThemeRubricStructure(currentSolutionThemeStructure);

        if(criteriaWeightageUpdatedCount == cirteriaWeightToUpdateCount) {
          return resolve({
            themes: currentSolutionThemeStructure,
            flattenedThemes : flatThemes,
            success : true
          });
        } else {
          throw new Error(messageConstants.apiResponses.CRITERIA_WEIGHTAGE_NOT_UPDATED);
        }

      } catch (error) {
        return reject(error);
      }
    });
  }

    /**
   * Generate flat themes rubric structure. 
   * @method
   * @name generateFlatThemeRubricStructure
   * @param {Object} solutionThemeStructure
   * @returns {Array} 
   */

  static generateFlatThemeRubricStructure(solutionThemeStructure) {


    let flattenThemes =  function (themes,hierarchyLevel = 0,hierarchyTrack = [],flatThemes = []) {
                  
      themes.forEach(theme => {
        
        if (theme.children) {

          theme.hierarchyLevel = hierarchyLevel;
          theme.hierarchyTrack = hierarchyTrack;

          let hierarchyTrackToUpdate = [...hierarchyTrack];
          hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]));

          flattenThemes(theme.children,hierarchyLevel+1,hierarchyTrackToUpdate,flatThemes);
          
          if(!theme.criteria) theme.criteria = new Array;
          if(!theme.immediateChildren) theme.immediateChildren = new Array;

          theme.children.forEach(childTheme => {
            if(childTheme.criteria) {
              childTheme.criteria.forEach(criteria => {
                theme.criteria.push(criteria);
              })
            }
            theme.immediateChildren.push(_.omit(childTheme,["children","rubric","criteria","hierarchyLevel","hierarchyTrack"]));
          })

          flatThemes.push(_.omit(theme,["children"]));

        } else {

          theme.hierarchyLevel = hierarchyLevel;
          theme.hierarchyTrack = hierarchyTrack;

          let hierarchyTrackToUpdate = [...hierarchyTrack];
          hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]));

          let themeCriteriaArray = new Array;

          theme.criteria.forEach(criteria => {
            themeCriteriaArray.push({
                criteriaId : criteria.criteriaId,
                weightage : criteria.weightage
            });
          })

          theme.criteria = themeCriteriaArray;

          flatThemes.push(theme);

        }

      })

      return flatThemes;
    }
    
    let flatThemeStructure = flattenThemes(_.cloneDeep(solutionThemeStructure));
    
    return flatThemeStructure;

  }

  /**
   * Search solutions.
   * @method
   * @name search
   * @param {Object} filteredData - Search solutions from filtered data.
   * @param {Number} pageSize - page limit.
   * @param {Number} pageNo - No of the page. 
   * @returns {Array} List of solutions document. 
   */

  static search(filteredData, pageSize, pageNo) {
    return new Promise(async (resolve, reject) => {
      try {

        let solutionDocument = [];

        let projection1 = {};
        projection1["$project"] = {
          name: 1,
          description: 1,
          keywords: 1,
          externalId: 1,
          programId: 1,
          entityTypeId: 1
        };

        let facetQuery = {};
        facetQuery["$facet"] = {};

        facetQuery["$facet"]["totalCount"] = [
          { "$count": "count" }
        ];

        facetQuery["$facet"]["data"] = [
          { $skip: pageSize * (pageNo - 1) },
          { $limit: pageSize }
        ];

        let projection2 = {};
        projection2["$project"] = {
          "data": 1,
          "count": {
            $arrayElemAt: ["$totalCount.count", 0]
          }
        };

        solutionDocument.push(filteredData, projection1, facetQuery, projection2);

        let solutionDocuments = await database.models.solutions.aggregate(solutionDocument);

        return resolve(solutionDocuments);

      } catch (error) {
        return reject(error);
      }
    })
  }

  /**
   * Mandatory data for solutions.Required when updating the solutions.
   * @method
   * @name mandatoryField 
   * @returns {Object} Mandatory fields data. 
   */

  static mandatoryField() {

    let mandatoryFields = {
      type: "assessment",
      subType: "institutional",

      status: "active",

      isDeleted: false,
      isReusable: false,

      roles: {
        projectManagers: {
          acl: {
            entityProfile: {
              editable: [
                "all"
              ],
              visible: [
                "all"
              ]
            }
          }
        },
        leadAssessors: {
          acl: {
            entityProfile: {
              editable: [
                "all"
              ],
              visible: [
                "all"
              ]
            }
          }
        },
        assessors: {
          acl: {
            entityProfile: {
              editable: [
                "all"
              ],
              visible: [
                "all"
              ]
            }
          }
        }
      },

      evidenceMethods: {},
      sections: {},
      registry: [],
      type: "assessment",
      subType: "institutional",
      entityProfileFieldsPerEntityTypes: {
        "A1": []
      }

    }

    return mandatoryFields;

  }

   /**
     * Get library solutions.
     * @method
     * @name template
     * @param {String} - userId 
     * @param {string} - type
     * @returns {Array} - List of library solutions.
     */

    static templates( userId, type) {
      return new Promise(async (resolve, reject) => {
          try {

              let solutionIds = [];

              let queryObject = {
                 isReusable : true
              };
            
              if (type == "observation") {

              solutionIds =  await observationsHelper.observationDocuments
              (
               {createdBy : userId},
               [
                   "solutionId"
               ]
              );
              } 
              
              else if (type == "individual" || type == "institutional") {
              
              solutionIds =  await entityAssessorsHelper.assessorsDocument
              (
               { 
                 userId : userId,
               },
               [
                   "solutionId"
               ]
              );

              queryObject.type = "assessment";
              queryObject.subType = type;

              }
              
              let solutionArray = [];

              if (solutionIds.length > 0) {
                  solutionIds.forEach(solutionData => {
                      if(!solutionArray.includes(solutionData.solutionId.toString()) ) {
                        solutionArray.push(solutionData.solutionId.toString());
                      }
                  })
              }

              queryObject._id = { $in : solutionArray };

              let templateSolutions = 
               await this.solutionDocuments
               (
                queryObject,
                [
                  "externalId",
                  "name",
                  "description",
                  "programId",
                  "programExternalId",
                  "programName",
                  "programDescription",
                  "startDate",
                  "endDate",
                  "status"
               ])

              return resolve({
                  message: messageConstants.apiResponses.TEMPLATE_SOLUTIONS_FETCHED,
                  result : templateSolutions
              });
          } catch (error) {
              return reject(error);
          }
      });
  }

    /**
     * Solution metaform information. 
     * @method
     * @name metaForm
     * @param {string} solutionType - solution type
     * @returns {Array} - solution metaForm information
     */

    static metaForm( solutionType,userId ) {
      return new Promise(async (resolve, reject) => {
          try {

            let formName;

            if( solutionType === messageConstants.common.OBSERVATION ) {
              formName = messageConstants.common.OBSERVATION_SOLUTIONS_METAFORM;
            } else if ( solutionType === messageConstants.common.INSTITUTIONS ) {
              formName = messageConstants.common.INSTITUTIONS_SOLUTIONS_METAFORM;
            } else {
              formName = messageConstants.common.INDIVIDUAL_SOLUTIONS_METAFORM;
            }

            let solutionsMetaForm = await database.models.forms.findOne(
              { 
                "name": formName
              }, { 
                value: 1 
              }).lean();

            let programsDocument = await programsHelper.list({
              createdBy : userId
            },["_id"]);

            let programFormIndex = 
              solutionsMetaForm.value.findIndex(form=>form.field === "program");

            if ( programsDocument.length > 0 ) {
              solutionsMetaForm.value[programFormIndex]["enableSelect"] = true; 
            } else {
              solutionsMetaForm.value[programFormIndex]["enableSelect"] = false;
            }

            return resolve({
              message: messageConstants.apiResponses.SOLUTION_META_FORM_FETCHED,
              result : solutionsMetaForm.value
          });
          } catch (error) {
              return reject(error);
          }
        });
      }

     /**
     * Create solution from library template. 
     * @method
     * @name make
     * @param {string} solutionType - solution type
     * @returns {Array} - Create solution from library template.
     */

    static make( templateId,type,userId,requestedData,token ) {
      return new Promise(async (resolve, reject) => {
          try {

            let formData = {};

            requestedData.forEach(data=>{
              formData[data.field] = data.value;
            })

            let programDocument;
            
            if ( !_.isEmpty(formData.program) && formData.program.id !== "" ) {
              
              programDocument = await programsHelper.list(
                {
                  _id : formData.program.id
                },[
                  "name",
                  "externalId",
                  "description"
                ]
              );

              if( !programDocument[0]._id ) {
                throw {
                  status : httpStatusCode.bad_request.status,
                  message : messageConstants.apiResponses.PROGRAM_NOT_FOUND
                }
              }

              programDocument = programDocument[0];

            } else {

              programDocument = await programsHelper.create(
                {
                  name : formData.program.name,
                  description : formData.program.name + " program",
                  userId : userId,
                  isAnIndividualProgram : true
                }
              )
            }

            let filterQueryData = {
              _id : templateId
            }

            if( type === messageConstants.common.OBSERVATION ) {
              filterQueryData["type"] = type;
            } else {
              filterQueryData["type"] = "assessment";
              filterQueryData["subType"] = type;
            }

            let solutionDocument = await this.solutionDocuments(
              filterQueryData,
              "all",
              [
                "author",
                "createdAt",
                "updatedAt",
                "createdBy",
                "updatedBy"
              ]
            );

            if( !solutionDocument[0] ) {
              throw {
                status : httpStatusCode.bad_request.status,
                message : messageConstants.apiResponses.SOLUTION_NOT_FOUND
              }
            }

            let solutionData = {...solutionDocument[0]};
            solutionData["author"] = userId;
            solutionData["createdBy"] = userId;
            solutionData["updatedBy"] = userId;
            solutionData["isReusable"] = false;
            solutionData["programId"] = programDocument._id;
            solutionData["programExternalId"] = programDocument.externalId;
            solutionData["programName"] = programDocument.name;
            solutionData["programDescription"] = programDocument.description;
            solutionData["name"] = formData.name;
            solutionData["description"] = formData.description;
            solutionData["externalId"] = formData.name;
            solutionData["parentSolutionId"] = solutionDocument[0]._id;

            let entitiesIdsToObjectId = 
            gen.utils.arrayIdsTobjectIds(formData.entities);

            if ( type === messageConstants.common.INSTITUTIONAL ) {
              solutionData["entities"] = entitiesIdsToObjectId;
            }

            let solution = await this.create(_.omit(solutionData,["_id"]));

            let result = {};
            result["solution"] = _.pick(solution,["name","description","_id"]);

            if( type === messageConstants.common.OBSERVATION ) {
              
              let observationData = {
                name : formData.name,
                description : formData.description,
                status : "published",
                startDate : new Date(),
                endDate : new Date(),
                entities : entitiesIdsToObjectId
              };

              let observation = 
              await observationsHelper.create(
                solution._id,
                observationData,
                userId,
                token,
                "v2"
              );

              result["observation"] = observation;
            }

            await database.models.programs.findOneAndUpdate(
              {
                _id : programDocument
              },{ 
                $addToSet: { components: solution._id } 
              }
            );

            return resolve({
              message: messageConstants.apiResponses.CREATED_SOLUTION,
              result : result
            });

          } catch (error) {
              return reject(error);
          }
      });
    }


  /**
     * Get template solution details
     * @method
     * @name templateDetails
     * @param {String} - solutionId 
     * @returns {Object} - Details of template solution
     */

    static templateDetails(solutionId) {
      return new Promise(async (resolve, reject) => {
        try {
  
          let solutionDetails =
            await this.solutionDocuments(
              {
                _id: solutionId
              }, [
                "creator",
                "description",
                "themes",
                "type",
                "evidenceMethods",
                "linkTitle",
                "linkUrl"
              ]
            )
  
          let result = {
            creator: solutionDetails[0].creator ? solutionDetails[0].creator : "",
            about: solutionDetails[0].description ? solutionDetails[0].description : "",
          }
  
          let criteriaIds = await gen.utils.getCriteriaIds(solutionDetails[0].themes);
  
          let criteriaDocuments = await criteriaHelper.criteriaDocument({
            _id: { $in: criteriaIds }
          }, [
              "evidences"
            ])
  
          if (solutionDetails[0].type == "observation") {
  
            let questionArray = await gen.utils.getAllQuestionId(criteriaDocuments);
  
            let questionDocuments = await questionsHelper.questionDocument(
              {
                _id: { $in: questionArray }
              },
              [
                "question"
              ]
            )
  
            let questions = [];
  
            questionDocuments.forEach(questionName => {
              questions.push(questionName.question[0]);
            })
  
            result.questions = questions;
  
          } else if (solutionDetails[0].type == "assessment") {
  
            let sections = [];
            let questionArray = [];
  
            criteriaDocuments[0].evidences.forEach(eachEvidence => {
              let sectionObj = {};
  
              sectionObj.name = solutionDetails[0].evidenceMethods[eachEvidence.code].name;
              
              eachEvidence.sections.forEach(eachSection => {
                questionArray.push(eachSection.questions[0]);
                sectionObj.question = eachSection.questions[0];
              })
  
              sections.push(sectionObj);
            })
  
            let questionDocuments = await questionsHelper.questionDocument(
              {
                _id: { $in: questionArray }
              },
              [
                "question"
              ]
            )
  
            let questionData = questionDocuments.reduce(
              (ac, question) => ({
                ...ac,
                [question._id.toString()]: question
              }), {});
  
  
            sections.forEach(section => {
  
              section.question = questionData[section.question.toString()].question[0];
            })
            
            result.linkTitle = solutionDetails[0].linkTitle ? solutionDetails[0].linkTitle : "";
            result.linkUrl = solutionDetails[0].linkUrl ? solutionDetails[0].linkUrl : "";
            result.sections = sections;
          }
  
          return resolve({
            message: messageConstants.apiResponses.TEMPLATE_SOLUTION_DETAILS_FETCHED,
            result: result
          });
        } catch (error) {
          return reject(error);
        }
      });
    }
  

};
