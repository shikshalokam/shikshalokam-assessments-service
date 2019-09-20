
module.exports = class questionsHelper {

  static upload(questionData) {
    return new Promise(async (resolve, reject) => {
      try {

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
          throw "No criteria found"
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
            }
          )
          .lean();

        return resolve({
          solutionDocument: solutionDocument,
          criteriaMap: criteriaMap,
          currentQuestionMap: currentQuestionMap,
          allQuestionsDocument: allQuestionsDocument,
        })

      } catch (error) {
        return reject(error);
      }
    })
  }

  static createQuestion(parsedQuestion) {

    return new Promise(async (resolve, reject) => {

      try {

        let questionDataModel = Object.keys(questionsSchema.schema)

        let includeFieldByDefault = {
          "remarks": "",
          "value": "",
          "usedForScoring": "",
          "questionType": "auto",
          "deleted": false,
          "canBeNotApplicable": "false",
          "isCompleted": false,
          "value": ""
        }

        let allValues = {}

        Object.keys(includeFieldByDefault).forEach(eachFieldToBeIncluded => {
          allValues[eachFieldToBeIncluded] = includeFieldByDefault[eachFieldToBeIncluded]
        })

        let fieldNotIncluded = ["instanceIdentifier", "dateFormat", "autoCapture", "isAGeneralQuestion"]

        allValues["question"] = new Array

        allValues.question.push(
          parsedQuestion["question0"],
          parsedQuestion["question1"]
        )

        allValues["visibleIf"] = questionsHelper.getQuestionVisibleIf(parsedQuestion["_parentQuestionId"], parsedQuestion["parentQuestionOperator"], parsedQuestion.parentQuestionValue)

        let generateResponseTypeAndValidation = questionsHelper.addValidationAndResponseType(_.pick(parsedQuestion, ["responseType", "validation", "instanceIdentifier", "dateFormat", "autoCapture", "validationIsNumber", "validationRegex", "validationMax", "validationMin"]))

        allValues["responseType"] = generateResponseTypeAndValidation.responseType
        allValues["validation"] = generateResponseTypeAndValidation.validation

        allValues["fileName"] = []

        allValues["file"] = questionsHelper.addFileInQuestion(_.pick(parsedQuestion, ["file", "fileIsRequired", "fileUploadType", "minFileCount", "maxFileCount", "caption"]))

        allValues["questionGroup"] = parsedQuestion["questionGroup"] ? parsedQuestion["questionGroup"].split(',') : "A1"

        allValues["options"] = questionsHelper.questionResponse(parsedQuestion)

        Object.keys(parsedQuestion).forEach(parsedQuestionData => {
          if (!fieldNotIncluded.includes(parsedQuestionData) && !allValues[parsedQuestionData] && questionDataModel.includes(parsedQuestionData)) {
            if (this.booleanData().includes(parsedQuestionData)) {
              allValues[parsedQuestionData] = this.convertStringToBoolean(parsedQuestion[parsedQuestionData])
            } else {
              allValues[parsedQuestionData] = parsedQuestion[parsedQuestionData]
            }
          }
        })

        let createQuestion = await database.models.questions.create(
          allValues
        )

        if (!createQuestion._id) {
          parsedQuestion["_SYSTEM_ID"] = "Not Created"
          parsedQuestion["UPLOAD_STATUS"] = "Failure"
        } else {
          parsedQuestion["_SYSTEM_ID"] = createQuestion._id
          parsedQuestion["UPLOAD_STATUS"] = "Success"


          if (parsedQuestion["_parentQuestionId"] != "") {


            let findQuery = { _id: parsedQuestion["_parentQuestionId"] }

            let updateQuery = {
              $addToSet: {
                ["children"]: createQuestion._id
              }
            }

            let updateQuestionStatus = await questionsHelper.questionUpdateDocument(findQuery, updateQuery, { _id: 1 })

            parsedQuestion["UPLOAD_STATUS"] = updateQuestionStatus.result

          }

          if (parsedQuestion["_instanceParentQuestionId"] != "" && parsedQuestion["responseType"] != "matrix") {

            let findQuery = {
              _id: parsedQuestion["_instanceParentQuestionId"],
              responseType: "matrix"
            }

            let updateQuery = {
              $addToSet: {
                ["instanceQuestions"]: createQuestion._id
              }
            }

            let updateQuestionStatus = await questionsHelper.questionUpdateDocument(findQuery, updateQuery, { _id: 1 })

            parsedQuestion["UPLOAD_STATUS"] = updateQuestionStatus.result

          }

          if (parsedQuestion["_criteriaInternalId"] != "" && parsedQuestion["_evidenceMethodCode"] != "" && parsedQuestion["_sectionCode"] != "") {

            let criteriaToUpdate = await database.models.criteria.findOne(
              {
                _id: ObjectId(parsedQuestion["_criteriaInternalId"])
              },
              {
                evidences: 1
              }
            ).lean()

            let updateData = {
              ecm: parsedQuestion["_evidenceMethodCode"],
              section: parsedQuestion["_sectionCode"],
              questionId: createQuestion._id,
              criteriaToUpdate: criteriaToUpdate
            }

            let updateCriteria = await questionsHelper.updateCriteria(updateData)

            parsedQuestion["UPLOAD_STATUS"] = updateCriteria.criteriaUpdateStatus

          }

        }

        return resolve(parsedQuestion)

      } catch (error) {
        return reject(error);
      }
    })

  }

  static updateQuestion(parsedQuestion) {

    return new Promise(async (resolve, reject) => {

      try {

        let questionDataModel = Object.keys(questionsSchema.schema)

        let existingQuestion = await database.models.questions
          .findOne(
            { _id: ObjectId(parsedQuestion["_SYSTEM_ID"]) }, {
              createdAt: 0,
              updatedAt: 0
            }
          )
          .lean();


        if (!existingQuestion._id) {

          parsedQuestion["UPDATE_STATUS"] = "Question id is not present in database."

        } else {

          existingQuestion.visibleIf = questionsHelper.getQuestionVisibleIf(parsedQuestion["_parentQuestionId"], parsedQuestion["parentQuestionOperator"], parsedQuestion.parentQuestionValue)

          if (parsedQuestion["question0"]) {
            existingQuestion.question[0] = parsedQuestion["question0"]
          }

          if (parsedQuestion["question1"]) {
            existingQuestion.question[1] = parsedQuestion["question1"]
          }

          let generateResponseTypeAndValidation = questionsHelper.addValidationAndResponseType(_.pick(parsedQuestion, ["responseType", "validation", "instanceIdentifier", "dateFormat", "autoCapture", "validationIsNumber", "validationRegex", "validationMax", "validationMin"]))

          existingQuestion["responseType"] = generateResponseTypeAndValidation.responseType
          existingQuestion["validation"] = generateResponseTypeAndValidation.validation

          existingQuestion.file = questionsHelper.addFileInQuestion(_.pick(parsedQuestion, ["file", "fileIsRequired", "fileUploadType", "minFileCount", "maxFileCount", "caption"]))

          existingQuestion["fileName"] = new Array

          if (parsedQuestion["questionGroup"]) {
            existingQuestion["questionGroup"] = parsedQuestion["questionGroup"] = parsedQuestion["questionGroup"].split(',')
          }

          existingQuestion["options"] = questionsHelper.questionResponse(parsedQuestion)

          Object.keys(parsedQuestion).forEach(parsedQuestionData => {
            if (!_.startsWith(parsedQuestionData, "_") && questionDataModel.includes(parsedQuestionData)) {
              if (this.booleanData().includes(parsedQuestionData)) {
                existingQuestion[parsedQuestionData] = this.convertStringToBoolean(parsedQuestion[parsedQuestionData])
              } else {
                existingQuestion[parsedQuestionData] = parsedQuestion[parsedQuestionData]
              }
            }
          })

          let updateQuestion = await database.models.questions.findOneAndUpdate(
            { _id: existingQuestion._id },
            existingQuestion,
            { _id: 1 }
          ).lean()

          if (!updateQuestion._id) {
            parsedQuestion["UPDATE_STATUS"] = "Question Not Updated"
          } else {

            parsedQuestion["UPDATE_STATUS"] = "Success"

            if (parsedQuestion["_parentQuestionId"] != "") {

              let findQuery = { _id: parsedQuestion["_parentQuestionId"] }

              let updateQuery = {
                $addToSet: {
                  ["children"]: updateQuestion._id
                }
              }

              let updateQuestionStatus = await questionsHelper.questionUpdateDocument(findQuery, updateQuery, { _id: 1 })

              parsedQuestion["UPDATE_STATUS"] = updateQuestionStatus.result

            }


            if (parsedQuestion["_instanceParentQuestionId"] != "" && parsedQuestion["responseType"] != "matrix") {

              let findQuery = {
                _id: parsedQuestion["_instanceParentQuestionId"],
                responseType: "matrix"
              }

              let updateQuery = {
                $addToSet: {
                  ["instanceQuestions"]: updateQuestion._id
                }
              }

              let updateQuestionStatus = await questionsHelper.questionUpdateDocument(findQuery, updateQuery, { _id: 1 })

              parsedQuestion["UPDATE_STATUS"] = updateQuestionStatus.result

            }

            if (parsedQuestion["_setQuestionInCriteria"] && parsedQuestion["_criteriaInternalId"] != "" && parsedQuestion["_evidenceMethodCode"] != "" && parsedQuestion["_sectionCode"] != "") {

              let criteriaToUpdate = await database.models.criteria.findOne(
                {
                  _id: ObjectId(parsedQuestion["_criteriaInternalId"])
                },
                {
                  evidences: 1
                }
              )

              let updateData = {
                ecm: parsedQuestion["_evidenceMethodCode"],
                section: parsedQuestion["_sectionCode"],
                questionId: updateQuestion._id,
                criteriaToUpdate: criteriaToUpdate
              }

              let updateCriteria = await questionsHelper.updateCriteria(updateData)

              parsedQuestion["UPLOAD_STATUS"] = updateCriteria.criteriaUpdateStatus

            }
          }
        }

        return resolve(parsedQuestion)

      } catch (error) {
        return reject(error);
      }
    })

  }

  static getQuestionVisibleIf(parentQuestionId, parentQuestionOperator, parentQuestionValue) {

    let visibleIf

    if (parentQuestionId === "") {
      visibleIf = ""
    } else {

      let operator = parentQuestionOperator == "EQUALS" ? parentQuestionOperator = "===" : parentQuestionOperator

      visibleIf = new Array

      visibleIf.push({
        operator: operator,
        value: parentQuestionValue,
        _id: ObjectId(parentQuestionId)
      })

    }
    return visibleIf
  }

  static booleanData() {
    let booleanData = ["allowAudioRecording", "showRemarks", "isAGeneralQuestion"]
    return booleanData
  }

  static convertStringToBoolean(stringData) {
    let stringToBoolean = (stringData === "TRUE" || stringData === "true")
    return stringToBoolean
  }

  static allowedFileUploads() {

    // Key is what is supplied in CSV and value is what is sent to app
    let fileTypes = {
      "image/jpeg": "image/jpeg",
      "aif": "aif",
      "cda": "cda",
      "mp3": "mp3",
      "mpa": "mpa",
      "ogg": "ogg",
      "wav": "wav",
      "wma": "wma",
      "mp4": "mp4",
      "mp3": "mp3",
      "wmv": "wmv",
      "webm": "webm",
      "flv": "flv",
      "avi": "avi",
      "3gp": "3gp",
      "ogg": "ogg",
      "ppt": "ppt",
      "pptx": "pptx",
      "pps": "pps",
      "ppsx": "ppsx",
      "pdf": "pdf",
      "docx": "docx",
      "doc": "doc",
      "docm": "docm",
      "dotx": "dotx",
      "xls": "xls",
      "xlsx": "xlsx"
    }

    return fileTypes

  }

  static getAllQuestionId(criteria) {
    let questionIds = [];
    criteria.forEach(eachCriteria => {
      eachCriteria.evidences.forEach(eachEvidence => {
        eachEvidence.sections.forEach(eachSection => {
          eachSection.questions.forEach(eachQuestion => {
            questionIds.push(eachQuestion)
          })
        })
      })
    })
    return questionIds
  }

  static addValidationAndResponseType(parsedQuestion) {
    let result = {}

    if (parsedQuestion.responseType !== "") {

      result["responseType"] = parsedQuestion.responseType
      result["validation"] = {}
      result["validation"]["required"] = this.convertStringToBoolean(gen.utils.lowerCase(parsedQuestion["validation"]))

      if (parsedQuestion["responseType"] == "matrix") {
        result["instanceIdentifier"] = parsedQuestion["instanceIdentifier"]
      }

      if (parsedQuestion["responseType"] == "date") {
        result["dateFormat"] = parsedQuestion.dateFormat
        result["autoCapture"] = gen.utils.lowerCase(parsedQuestion.autoCapture)
        result["validation"]["max"] = parsedQuestion.validationMax
        result["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : parsedQuestion.validationMin = ""
      }

      if (parsedQuestion["responseType"] == "number") {

        result["validation"]["IsNumber"] = gen.utils.lowerCase(parsedQuestion["validationIsNumber"])

        if (parsedQuestion["validationRegex"] == "IsNumber") {
          result["validation"]["regex"] = "^[0-9s]*$"
        }

      }

      if (parsedQuestion["responseType"] == "slider") {
        if (parsedQuestion["validationRegex"] == "IsNumber") {
          result["validation"]["regex"] = "^[0-9s]*$"
        }
        result["validation"]["max"] = parsedQuestion.validationMax
        result["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : ""
      }

    }

    return result
  }

  static addFileInQuestion(questionFile) {

    let result = {}

    if (questionFile.file != "NA") {

      result["required"] = gen.utils.lowerCase(questionFile.fileIsRequired)
      result["type"] = new Array
      let allowedFileUploads = this.allowedFileUploads()

      questionFile.fileUploadType.split(",").forEach(fileType => {
        if (allowedFileUploads[fileType] && allowedFileUploads[fileType] != "") {
          result.type.push(allowedFileUploads[fileType])
        }
      })
      result["minCount"] = parseInt(questionFile.minFileCount)
      result["maxCount"] = parseInt(questionFile.maxFileCount)
      result["caption"] = questionFile.caption ? questionFile.caption : ""
    }
    return result
  }

  static questionResponse(parsedQuestion) {

    let options = new Array()

    for (let pointerToResponseCount = 1; pointerToResponseCount < 10; pointerToResponseCount++) {
      let optionValue = "R" + pointerToResponseCount
      let optionHint = "R" + pointerToResponseCount + "-hint"

      if (parsedQuestion[optionValue] && parsedQuestion[optionValue] != "") {
        let eachOption = {
          value: optionValue,
          label: parsedQuestion[optionValue]
        }
        if (parsedQuestion[optionHint] && parsedQuestion[optionHint] != "") {
          eachOption.hint = parsedQuestion[optionHint]
        }
        options.push(eachOption)
      }

    }

    return options
  }

  static updateCriteria(updateData) {
    return new Promise(async (resolve, reject) => {
      try {

        let criteriaEvidences = updateData.criteriaToUpdate.evidences

        let indexOfEvidenceMethodInCriteria = criteriaEvidences.findIndex(evidence => evidence.code === updateData.ecm);

        if (indexOfEvidenceMethodInCriteria < 0) {
          criteriaEvidences.push({
            code: updateData.ecm,
            sections: new Array
          })
          indexOfEvidenceMethodInCriteria = criteriaEvidences.length - 1
        }

        let questionSection = updateData.section

        let indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.findIndex(section => section.code === questionSection)

        if (indexOfSectionInEvidenceMethod < 0) {
          criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.push({ code: questionSection, questions: new Array })
          indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.length - 1
        }

        criteriaEvidences[indexOfEvidenceMethodInCriteria].sections[indexOfSectionInEvidenceMethod].questions.push(updateData.questionId)

        let queryCriteriaObject = {
          _id: updateData.criteriaToUpdate._id
        }

        let updateCriteriaObject = {}
        updateCriteriaObject.$set = {
          ["evidences"]: criteriaEvidences
        }

        let criteriaUpdateDocument = await database.models.criteria.findOneAndUpdate(
          queryCriteriaObject,
          updateCriteriaObject
        ).lean()

        let criteriaUpdateStatus

        if (criteriaUpdateDocument._id) {
          criteriaUpdateStatus = "Criteria updated successfully"
        } else {
          criteriaUpdateStatus = "Criteria could not be updated"
        }

        return resolve({
          criteriaUpdateStatus: criteriaUpdateStatus
        })

      } catch (error) {
        return reject(error);
      }
    })
  }

  static questionUpdateDocument(findQuery, updateQuery, projection) {
    return new Promise(async (resolve, reject) => {

      try {
        let updateQuestions = await database.models.questions.findOneAndUpdate(findQuery, updateQuery, projection)

        let result
        if (!updateQuestions._id) {
          result = "Question could not be updated"
        } else {
          result = "Success"
        }

        return resolve({
          result: result
        })

      } catch (error) {
        return reject(error);
      }
    })
  }
};