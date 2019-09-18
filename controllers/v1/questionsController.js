const csv = require("csvtojson");
const questionsHelper = require(ROOT_PATH + "/module/questions/helper");
const solutionsHelper = require(ROOT_PATH + "/module/solutions/helper");
const FileStream = require(ROOT_PATH + "/generics/fileStream");

module.exports = class Questions extends Abstract {
  constructor() {
    super(questionsSchema);
  }

  static get name() {
    return "questions";
  }

  /**
   * @api {post} /assessment/api/v1/questions/bulkCreate Bulk Create Questions CSV
   * @apiVersion 0.0.1
   * @apiName Bulk Create Questions CSV
   * @apiGroup Questions
   * @apiParam {File} questions Mandatory questions file of type CSV.
   * @apiUse successBody
   * @apiUse errorBody
   */
  bulkCreate(req) {
    return new Promise(async (resolve, reject) => {
      try {

        if (!req.files || !req.files.questions) {
          let responseMessage = "Bad request.";
          return resolve({ status: 400, message: responseMessage });
        }

        let questionsData = await csv().fromString(
          req.files.questions.data.toString()
        );

        let questions = await questionsHelper.upload(questionsData)

        let solutionDocument = await database.models.solutions
          .findOne(
            { externalId: questionsData[0]["solutionId"] },
            { evidenceMethods: 1, sections: 1, themes: 1 }
          )
          .lean();


        let criteriasIdArray = gen.utils.getCriteriaIds(
          solutionDocument.themes
        );

        if (criteriasIdArray.length < 1) {
          throw "No criteria found for the given solution"
        }

        let allCriteriaDocument = await database.models.criteria
          .find({ _id: { $in: criteriasIdArray } }, { evidences: 1, externalId: 1 })
          .lean();

        if (allCriteriaDocument.length < 1) {
          throw "No criteria found for the given solution"
        }


        let currentQuestionMap = {};

        let criteriaMap = {};

        allCriteriaDocument.forEach(eachCriteria => {

          criteriaMap[eachCriteria.externalId] = eachCriteria._id.toString()

          eachCriteria.evidences.forEach(eachEvidence => {
            eachEvidence.sections.forEach(eachSection => {
              eachSection.questions.forEach(eachQuestion => {
                currentQuestionMap[eachQuestion.toString()] = {
                  qid: eachQuestion.toString()
                }
              })
            })
          })
        })

        // for few questions we are loading all the questions in the criterias

        let allQuestionsDocument = await database.models.questions
          .find(
            { _id: { $in: Object.keys(currentQuestionMap) } },
            {
              externalId: 1
            }
          )
          .lean();

        let questionExternalToInternalIdMap = {};

        if (allQuestionsDocument.length > 0) {
          allQuestionsDocument.forEach(eachQuestion => {
            questionExternalToInternalIdMap[eachQuestion.externalId] = eachQuestion._id.toString()
          });
        }

        const fileName = `Question-Upload-Result`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath()
          });
        })();

        let pendingItems = new Array();
        let pushToPendingItems = false

        for (
          let pointerToQuestionData = 0;
          pointerToQuestionData < questionsData.length;
          pointerToQuestionData++
        ) {

          let parsedQuestion = gen.utils.valueParser(
            questionsData[pointerToQuestionData]
          );

          pushToPendingItems = false

          if (!parsedQuestion["externalId"] || parsedQuestion["externalId"] == "" || questionExternalToInternalIdMap[parsedQuestion["externalId"]]) {
            parsedQuestion["UPLOAD_STATUS"] = "Invalid question External ID"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          }

          if (!parsedQuestion["criteriaExternalId"] || parsedQuestion["criteriaExternalId"] == "" || !criteriaMap[parsedQuestion["criteriaExternalId"]]) {
            parsedQuestion["UPLOAD_STATUS"] = "Invalid Criteria External ID"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          } else {
            parsedQuestion["_criteriaInternalId"] = criteriaMap[parsedQuestion["criteriaExternalId"]]
          }

          let ecm = (solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]] && solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId) ? solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId : ""
          if (ecm == "") {
            parsedQuestion["UPLOAD_STATUS"] = "Invalid Evidence Method Code"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          } else {
            parsedQuestion["_evidenceMethodCode"] = solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId
          }

          let section = (solutionDocument.sections[parsedQuestion.section]) ? solutionDocument.sections[parsedQuestion.section] : ""
          if (section == "") {
            parsedQuestion["UPLOAD_STATUS"] = "Invalid Section Method Code"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }))
            continue
          } else {
            parsedQuestion["_sectionCode"] = parsedQuestion.section
          }

          // Parent question CSV data validation begins.
          parsedQuestion["hasAParentQuestion"] = parsedQuestion["hasAParentQuestion"].toUpperCase()

          if (parsedQuestion["hasAParentQuestion"] != "YES" && parsedQuestion["hasAParentQuestion"] != "NO") {

            parsedQuestion["UPLOAD_STATUS"] = "Invalid value for column hasAParentQuestion"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue

          } else if (parsedQuestion["hasAParentQuestion"] == "YES") {

            if (parsedQuestion["parentQuestionId"] == "") {
              parsedQuestion["UPLOAD_STATUS"] = "Invalid Parent Question ID"
              parsedQuestion["_SYSTEM_ID"] = "Not Created"
              input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
              continue
            } else if (currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]]) { // It can be directly taken from questionExternalToInternalIdMap
              parsedQuestion["_parentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]
            } else {
              pushToPendingItems = true
            }

          } else if (parsedQuestion["hasAParentQuestion"] == "NO") {
            parsedQuestion["_parentQuestionId"] = ""
          }

          // Instance Parent question CSV data validation begins.
          // parsedQuestion["instanceParentQuestionId"] = parsedQuestion["instanceParentQuestionId"].toUpperCase()
          if (parsedQuestion["instanceParentQuestionId"] == "") {

            parsedQuestion["UPLOAD_STATUS"] = "Invalid value for column instanceParentQuestionId"
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" })); // No need to load everything. Only return specific field that is required.
            continue

          } else if (parsedQuestion["instanceParentQuestionId"] == "NA") {

            parsedQuestion["_instanceParentQuestionId"] = ""

          } else {

            if (currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]] && currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]] != "") {
              parsedQuestion["_instanceParentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]
            } else {
              pushToPendingItems = true
            }

          }
          // Instance Parent question CSV data validation ends.

          if (pushToPendingItems) {
            pendingItems.push(parsedQuestion);
            continue
          }

          let resultFromCreateQuestions = await questionsHelper.createQuestion(parsedQuestion)

          // stop here.
          if (resultFromCreateQuestions["_SYSTEM_ID"] && resultFromCreateQuestions["_SYSTEM_ID"].toString() != "") {
            currentQuestionMap[resultFromCreateQuestions["_SYSTEM_ID"].toString()] = {
              qid: resultFromCreateQuestions["_SYSTEM_ID"].toString()
            }
            questionExternalToInternalIdMap[resultFromCreateQuestions.externalId] = resultFromCreateQuestions["_SYSTEM_ID"].toString()
          } else {
            parsedQuestion["UPLOAD_STATUS"] = "Something went wrong while creating the question."
            parsedQuestion["_SYSTEM_ID"] = "Not Created"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          }

          input.push(resultFromCreateQuestions)

        }

        // Same logic repeated here.

        if (pendingItems.length > 0) {

          for (let pointerToPendingData = 0; pointerToPendingData < pendingItems.length; pointerToPendingData++) {

            let parsedQuestion = pendingItems[pointerToPendingData]

            // Parent question CSV data validation begins.
            if (parsedQuestion["hasAParentQuestion"] == "YES") {

              if (!currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]]) {
                parsedQuestion["UPLOAD_STATUS"] = "Invalid Parent Question ID"
                parsedQuestion["_SYSTEM_ID"] = "Not Created"
                input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
                continue
              } else {
                parsedQuestion["_parentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]
              }

            } else if (parsedQuestion["hasAParentQuestion"] == "NO") {
              parsedQuestion["_parentQuestionId"] = ""
            }

            // Parent question CSV data validation ends.

            // Instance Parent question CSV data validation begins.

            if (parsedQuestion["instanceParentQuestionId"] == "NA") {

              parsedQuestion["_instanceParentQuestionId"] = ""

            } else {

              if (currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]]) {
                parsedQuestion["_instanceParentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]
              } else {
                parsedQuestion["UPLOAD_STATUS"] = "Invalid value for column instanceParentQuestionId"
                parsedQuestion["_SYSTEM_ID"] = "Not Created"
                input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
                continue
              }

            }
            // Instance Parent question CSV data validation ends.

            let resultFromCreateQuestions = await questionsHelper.createQuestion(parsedQuestion)

            if (resultFromCreateQuestions["_SYSTEM_ID"] && resultFromCreateQuestions["_SYSTEM_ID"].toString() != "") {
              currentQuestionMap[resultFromCreateQuestions["_SYSTEM_ID"].toString()] = {
                qid: resultFromCreateQuestions["_SYSTEM_ID"].toString()
              }
              questionExternalToInternalIdMap[resultFromCreateQuestions.externalId] = resultFromCreateQuestions["_SYSTEM_ID"].toString()
            } else {
              parsedQuestion["UPLOAD_STATUS"] = "Something went wrong while creating the question."
              parsedQuestion["_SYSTEM_ID"] = "Not Created"
              input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
              continue
            }

            input.push(resultFromCreateQuestions)

          }
        }

        input.push(null);

      } catch (error) {
        reject({
          message: error
        });
      }
    });
  }

  /**
   * @api {post} /assessment/api/v1/questions/bulkUpdate Bulk Update Questions CSV
   * @apiVersion 0.0.1
   * @apiName Bulk Update Questions CSV
   * @apiGroup Questions
   * @apiParam {File} questions Mandatory questions file of type CSV.
   * @apiUse successBody
   * @apiUse errorBody
   */
  bulkUpdate(req) {
    return new Promise(async (resolve, reject) => {
      try {

        if (!req.files || !req.files.questions) {
          let responseMessage = "Bad request.";
          return resolve({ status: 400, message: responseMessage });
        }

        let questionData = await csv().fromString(
          req.files.questions.data.toString()
        );

        let solutionDocument = await database.models.solutions
          .findOne(
            { externalId: questionData[0]["solutionId"] },
            { evidenceMethods: 1, sections: 1, themes: 1 }
          )
          .lean();

        let criteriasIdArray = gen.utils.getCriteriaIds(
          solutionDocument.themes
        );

        if (criteriasIdArray.length < 1) {
          throw "No criteria found for the given solution"
        }

        let allCriteriaDocument = await database.models.criteria
          .find({ _id: { $in: criteriasIdArray } }, { evidences: 1, externalId: 1 })
          .lean();

        if (allCriteriaDocument.length < 1) {
          throw "No criteria found for the given solution"
        }

        let currentQuestionMap = {};

        let criteriaMap = {};

        allCriteriaDocument.forEach(eachCriteria => {

          criteriaMap[eachCriteria.externalId] = eachCriteria._id.toString()

          eachCriteria.evidences.forEach(eachEvidence => {
            eachEvidence.sections.forEach(eachSection => {
              eachSection.questions.forEach(eachQuestion => {
                currentQuestionMap[eachQuestion.toString()] = {
                  qid: eachQuestion.toString(),
                  sectionCode: eachSection.code,
                  evidenceMethodCode: eachEvidence.code,
                  criteriaId: eachCriteria._id.toString(),
                  criteriaExternalId: eachCriteria.externalId
                }
              })
            })
          })
        })

        let allQuestionsDocument = await database.models.questions
          .find(
            { _id: { $in: Object.keys(currentQuestionMap) } },
            {
              externalId: 1,
              children: 1,
              instanceQuestions: 1
            }
          )
          .lean();

        if (allQuestionsDocument.length < 1) {
          throw "No question found for the given solution"
        }

        let questionExternalToInternalIdMap = {};
        allQuestionsDocument.forEach(eachQuestion => {

          currentQuestionMap[eachQuestion._id.toString()].externalId = eachQuestion.externalId
          questionExternalToInternalIdMap[eachQuestion.externalId] = eachQuestion._id.toString()

          if (eachQuestion.children && eachQuestion.children.length > 0) {
            eachQuestion.children.forEach(childQuestion => {
              if (currentQuestionMap[childQuestion.toString()]) {
                currentQuestionMap[childQuestion.toString()].parent = eachQuestion._id.toString()
              }
            })
          }

          if (eachQuestion.instanceQuestions && eachQuestion.instanceQuestions.length > 0) {
            eachQuestion.instanceQuestions.forEach(instanceChildQuestion => {
              if (currentQuestionMap[instanceChildQuestion.toString()]) {
                currentQuestionMap[instanceChildQuestion.toString()].instanceParent = eachQuestion._id.toString()
              }
            })
          }

        });

        const fileName = `Question-Upload-Result`;
        let fileStream = new FileStream(fileName);
        let input = fileStream.initStream();

        (async function () {
          await fileStream.getProcessorPromise();
          return resolve({
            isResponseAStream: true,
            fileNameWithPath: fileStream.fileNameWithPath()
          });
        })();

        let pendingItems = new Array();

        for (
          let pointerToQuestionData = 0;
          pointerToQuestionData < questionData.length;
          pointerToQuestionData++
        ) {

          let parsedQuestion = gen.utils.valueParser(
            questionData[pointerToQuestionData]
          );

          if (!parsedQuestion["_SYSTEM_ID"] || parsedQuestion["_SYSTEM_ID"] == "" || !currentQuestionMap[parsedQuestion["_SYSTEM_ID"]]) {
            parsedQuestion["UPDATE_STATUS"] = "Invalid Question Internal ID"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          }

          if (!parsedQuestion["criteriaExternalId"] || parsedQuestion["criteriaExternalId"] == "" || !criteriaMap[parsedQuestion["criteriaExternalId"]]) {
            parsedQuestion["UPDATE_STATUS"] = "Invalid Criteria External ID"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          } else {
            parsedQuestion["_criteriaInternalId"] = criteriaMap[parsedQuestion["criteriaExternalId"]]
          }

          let ecm = (solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]] && solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId) ? solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId : ""
          if (ecm == "") {
            parsedQuestion["UPDATE_STATUS"] = "Invalid Evidence Method Code"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue
          } else {
            parsedQuestion["_evidenceMethodCode"] = solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]].externalId
          }

          let section = (solutionDocument.sections[parsedQuestion.section]) ? solutionDocument.sections[parsedQuestion.section] : ""
          if (section == "") {
            parsedQuestion["UPDATE_STATUS"] = "Invalid Section Method Code"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }))
            continue
          } else {
            parsedQuestion["_sectionCode"] = parsedQuestion.section
          }

          // Parent question CSV data validation begins.
          parsedQuestion["hasAParentQuestion"] = parsedQuestion["hasAParentQuestion"].toUpperCase()

          if (parsedQuestion["hasAParentQuestion"] != "YES" && parsedQuestion["hasAParentQuestion"] != "NO") {

            parsedQuestion["UPDATE_STATUS"] = "Invalid value for column hasAParentQuestion"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue

          } else if (parsedQuestion["hasAParentQuestion"] == "YES") {

            if (parsedQuestion["parentQuestionId"] == "" || !currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]]) {
              parsedQuestion["UPDATE_STATUS"] = "Invalid Parent Question ID"
              input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
              continue
            } else {
              parsedQuestion["_parentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["parentQuestionId"]]
            }

          } else if (parsedQuestion["hasAParentQuestion"] == "NO") {
            parsedQuestion["_parentQuestionId"] = ""
          }
          // Parent question CSV data validation ends.


          // Instance Parent question CSV data validation begins.
          parsedQuestion["instanceParentQuestionId"] = parsedQuestion["instanceParentQuestionId"].toUpperCase()
          if (parsedQuestion["instanceParentQuestionId"] && parsedQuestion["instanceParentQuestionId"] == "") {

            parsedQuestion["UPDATE_STATUS"] = "Invalid value for column instanceParentQuestionId"
            input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
            continue

          } else if (parsedQuestion["instanceParentQuestionId"] == "NA") {

            parsedQuestion["_instanceParentQuestionId"] = ""

          } else {

            if (currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]] && currentQuestionMap[questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]] != "") {
              parsedQuestion["_instanceParentQuestionId"] = questionExternalToInternalIdMap[parsedQuestion["instanceParentQuestionId"]]
            } else {
              parsedQuestion["UPDATE_STATUS"] = "Invalid Instance Parent Question ID"
              input.push(_.omitBy(parsedQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }));
              continue
            }

          }
          // Instance Parent question CSV data validation ends.

          let currentQuestion = currentQuestionMap[parsedQuestion["_SYSTEM_ID"]]

          if (currentQuestion.criteriaId != parsedQuestion["_criteriaInternalId"] || currentQuestion.sectionCode != parsedQuestion["_sectionCode"] || currentQuestion.evidenceMethodCode != parsedQuestion["_evidenceMethodCode"]) {
            // remove question from criteria (qid,criteiaid, ecm, section)
            let criteriaToUpdate = await database.models.criteria.findOne(
              {
                _id: ObjectId(currentQuestion.criteriaId)
              },
              {
                evidences: 1
              }
            )

            criteriaToUpdate.evidences.forEach(eachEvidence => {
              if (eachEvidence.code == currentQuestion.evidenceMethodCode) {
                eachEvidence.sections.forEach(eachSection => {
                  if (eachSection.code == currentQuestion.sectionCode) {
                    let newSectionQuestions = new Array
                    for (let questionObjectPointer = 0; questionObjectPointer < eachSection.questions.length; questionObjectPointer++) {
                      if (eachSection.questions[questionObjectPointer].toString() != currentQuestion.qid) {
                        newSectionQuestions.push(eachSection.questions[questionObjectPointer])
                      }
                    }
                    eachSection.questions = newSectionQuestions
                  }
                })
              }
            })

            let queryCriteriaObject = {
              _id: criteriaToUpdate._id
            }

            let updateCriteriaObject = {}
            updateCriteriaObject.$set = {
              ["evidences"]: criteriaToUpdate.evidences
            }

            await database.models.criteria.findOneAndUpdate(
              queryCriteriaObject,
              updateCriteriaObject
            )

            parsedQuestion["_setQuestionInCriteria"] = true
          }

          if (currentQuestion.instanceParent && currentQuestion.instanceParent != "" && currentQuestion.instanceParent != parsedQuestion["_instanceParentQuestionId"]) {
            // remove instance child from instance parent (childQid,instanceParentQid)
            await database.models.questions.findOneAndUpdate(
              {
                _id: ObjectId(currentQuestion.instanceParent)
              },
              {
                $pull: { instanceQuestions: ObjectId(currentQuestion.qid) }
              }, {
                _id: 1
              }
            );
          }


          if (currentQuestion.parent && currentQuestion.parent != "" && currentQuestion.parent != parsedQuestion["_parentQuestionId"]) {
            // remove child from parent and , parent from child (childQid,parentQid)

            await database.models.questions.findOneAndUpdate(
              {
                _id: ObjectId(currentQuestion.qid)
              },
              {
                $pull: { visibleIf: { "_id": ObjectId(currentQuestion.parent) } }
              }, {
                _id: 1
              }
            );

            await database.models.questions.findOneAndUpdate(
              {
                _id: ObjectId(currentQuestion.parent)
              },
              {
                $pull: { children: ObjectId(currentQuestion.qid) }
              }, {
                _id: 1
              }
            );
          }

          let updateQuestion = await questionsHelper.updateQuestion(
            parsedQuestion
          );

          input.push(_.omitBy(updateQuestion, (value, key) => { return _.startsWith(key, "_") && key != "_SYSTEM_ID" }))
        }

        input.push(null);

      } catch (error) {
        reject({
          message: error
        });
      }
    });
  }

};