
module.exports = class questionsHelper {

  static upload(questions) {
    return new Promise(async (resolve, reject) => {
      try {

        let criteriaIds = new Array();

        let solutionDocument = await database.models.solutions
          .findOne(
            { externalId: questions[0]["solutionId"] },
            { evidenceMethods: 1, sections: 1, themes: 1 }
          )
          .lean();

        let allCriteriasInSolutions = gen.utils.getCriteriaIds(
          solutionDocument.themes
        );

        let criteriasArray = allCriteriasInSolutions.map(eachCriteriaIdArray => {
          return eachCriteriaIdArray._id.toString()
        });


        let questionIds = new Array();

        questions.forEach(eachQuestionData => {
          let parsedQuestion = gen.utils.valueParser(eachQuestionData);

          if (parsedQuestion["criteriaExternalId"] && parsedQuestion["criteriaExternalId"] != "" && !criteriaIds.includes(parsedQuestion["criteriaExternalId"])) {
            criteriaIds.push(parsedQuestion["criteriaExternalId"]);
          }

          if (!questionIds.includes(parsedQuestion["externalId"])) {
            questionIds.push(parsedQuestion["externalId"]);
          }

          if (
            parsedQuestion["hasAParentQuestion"] !== "NO" &&
            !questionIds.includes(parsedQuestion["parentQuestionId"])
          ) {
            questionIds.push(parsedQuestion["parentQuestionId"]);
          }

          if (
            parsedQuestion["instanceParentQuestionId"] !== "NA" &&
            !questionIds.includes(parsedQuestion["instanceParentQuestionId"])
          ) {
            questionIds.push(parsedQuestion["instanceParentQuestionId"]);
          }
        });

        let criteriaDocument = await database.models.criteria
          .find({
            externalId: { $in: criteriaIds },
            frameworkCriteriaId: { $exists: true }
          }, {
              externalId: 1,
              _id: 1
            })
          .lean();

        if (!criteriaDocument.length > 0) {
          throw "No criteria found for the given solution"
        }

        let criteriaObject = {}

        criteriaDocument.forEach(eachCriteriaDocument => {

          if (criteriasArray.includes(eachCriteriaDocument._id.toString())) {

            criteriaObject[eachCriteriaDocument.externalId] = eachCriteriaDocument;
          }
        });

        let questionsFromDatabase = await database.models.questions
          .find({
            externalId: { $in: questionIds }
          }, {
              externalId: 1,
              _id: 1
            })
          .lean();


        let questionCollection = {};

        if (questionsFromDatabase.length > 0) {
          questionsFromDatabase.forEach(question => {
            questionCollection[question.externalId] = question;
          });
        }

        function parentQuestionInCsv(parsedQuestionData) {
          let question = {};

          if (
            parsedQuestionData["instanceParentQuestionId"] !== "NA" &&
            questionCollection[parsedQuestionData["instanceParentQuestionId"]]
          ) {
            question[parsedQuestionData["instanceParentQuestionId"]] =
              questionCollection[parsedQuestionData["instanceParentQuestionId"]];
          }

          if (
            parsedQuestionData["hasAParentQuestion"] == "YES" &&
            questionCollection[parsedQuestionData["parentQuestionId"]]
          ) {
            question[parsedQuestionData["parentQuestionId"]] =
              questionCollection[parsedQuestionData["parentQuestionId"]];
          }
          return question
        }

        let pendingItems = new Array();
        let csvArray = new Array();

        for (
          let pointerToQuestionData = 0;
          pointerToQuestionData < questions.length;
          pointerToQuestionData++
        ) {

          let parsedQuestion = gen.utils.valueParser(
            questions[pointerToQuestionData]
          );

          let criteria = {};
          let ecm = {};
          let csv = {}

          csv["Question External Id"] = parsedQuestion.externalId
          csv["Question Name"] = parsedQuestion["question0"]

          if (questionCollection[parsedQuestion["externalId"]]) {
            csv["UPLOAD_STATUS"] = "Question already exists"
            csvArray.push(csv)
            continue
          }

          if (solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]]) {
            ecm[parsedQuestion["evidenceMethod"]] = {
              code:
                solutionDocument.evidenceMethods[parsedQuestion["evidenceMethod"]]
                  .externalId
            };
          } else {

            csv["UPLOAD_STATUS"] = "Ecm is not found in the given solution"
            csvArray.push(csv)
            continue
          }

          if (criteriaObject[parsedQuestion.criteriaExternalId]) {
            criteria[parsedQuestion.criteriaExternalId] =
              criteriaObject[parsedQuestion.criteriaExternalId];
          } else {

            csv["UPLOAD_STATUS"] = "Criteria is not found in the given solution"
            csvArray.push(csv)
            continue
          }

          let section

          if (solutionDocument.sections[parsedQuestion.section]) {
            section = parsedQuestion.section;
          } else {

            csv["UPLOAD_STATUS"] = "section is not found in the given solution"
            csvArray.push(csv)
            continue
          }

          if (parsedQuestion["hasAParentQuestion"] === "") {
            csv["UPLOAD_STATUS"] = "hasAParentQuestion should be either YES or NO"
            csvArray.push(csv)
            continue
          }

          if (parsedQuestion["instanceParentQuestionId"] === "") {
            csv["UPLOAD_STATUS"] = "instanceParentQuestionId should be either NA or parent question id"
            csvArray.push(csv)
            continue
          }

          let parentQuestion = {}

          if (parsedQuestion["hasAParentQuestion"] == "YES" || parsedQuestionData["instanceParentQuestionId"] !== "NA") {
            parentQuestion = parentQuestionInCsv(_.pick(parsedQuestion, ["instanceParentQuestionId", "hasAParentQuestion", "parentQuestionId"]))

          }
          if (
            (parsedQuestion["hasAParentQuestion"] == "YES" &&
              !questionCollection[parsedQuestion["parentQuestionId"]]) ||
            (parsedQuestion["instanceParentQuestionId"] !== "NA" &&
              !questionCollection[parsedQuestion["instanceParentQuestionId"]])
          ) {
            pendingItems.push({
              csvResponse: csv,
              parsedQuestion: parsedQuestion,
              parentQuestion: parentQuestion,
              criteriaToBeSent: criteria,
              evaluationFrameworkMethod: ecm,
              section: section
            });
          } else {

            let resultFromCreateQuestions = await questionsHelper.createQuestions(parsedQuestion, parentQuestion, criteria, ecm, section)

            if (resultFromCreateQuestions.result) {
              questionCollection[resultFromCreateQuestions.result.externalId] =
                resultFromCreateQuestions.result;
            }

            csv = _.merge(csv, resultFromCreateQuestions.csvResult)
            csvArray.push(csv)
          }

        }

        if (pendingItems) {
          for (
            let pointerToPendingData = 0;
            pointerToPendingData < pendingItems.length;
            pointerToPendingData++
          ) {

            let csvQuestionData = await questionsHelper.createQuestions(pendingItems[pointerToPendingData].parsedQuestion, pendingItems[pointerToPendingData].parentQuestion, pendingItems[pointerToPendingData].criteriaToBeSent, pendingItems[pointerToPendingData].evaluationFrameworkMethod, pendingItems[pointerToPendingData].section)

            csvQuestionData.csvResult = _.merge(csvQuestionData.csvResult, pendingItems[pointerToPendingData].csvResponse)

            csvArray.push(csvQuestionData.csvResult);
          }
        }

        return resolve({
          csvData: csvArray
        })


      } catch (error) {
        return reject(error);
      }
    })
  }

  static createQuestions(parsedQuestion, parentQuestion, criteriaObject, evidenceCollectionMethodObject, questionSection) {

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

        let resultQuestion

        let csvResult = {}

        allValues["question"] = new Array

        allValues.question.push(
          parsedQuestion["question0"],
          parsedQuestion["question1"]
        )

        allValues["visibleIf"] = new Array

        if (parsedQuestion["hasAParentQuestion"] !== "YES") {
          allValues.visibleIf = ""
        } else {

          let operator = parsedQuestion["parentQuestionOperator"] == "EQUALS" ? parsedQuestion["parentQuestionOperator"] = "===" : parsedQuestion["parentQuestionOperator"]

          allValues.visibleIf.push({
            operator: operator,
            value: parsedQuestion.parentQuestionValue,
            _id: parentQuestion[parsedQuestion["parentQuestionId"]] ? parentQuestion[parsedQuestion["parentQuestionId"]]._id : null
          })

        }

        if (parsedQuestion["responseType"] !== "") {
          allValues["validation"] = {}
          allValues["validation"]["required"] = gen.utils.lowerCase(parsedQuestion["validation"])

          if (parsedQuestion["responseType"] == "matrix") {
            allValues["instanceIdentifier"] = parsedQuestion["instanceIdentifier"]
          }

          if (parsedQuestion["responseType"] == "date") {
            allValues["dateFormat"] = parsedQuestion.dateFormat
            allValues["autoCapture"] = gen.utils.lowerCase(parsedQuestion.autoCapture)
            allValues["validation"]["max"] = parsedQuestion.validationMax
            allValues["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : parsedQuestion.validationMin = ""
          }

          if (parsedQuestion["responseType"] == "number") {

            allValues["validation"]["IsNumber"] = gen.utils.lowerCase(parsedQuestion["validationIsNumber"])

            if (parsedQuestion["validationRegex"] == "IsNumber") {
              allValues["validation"]["regex"] = "^[0-9s]*$"
            }

          }

          if (parsedQuestion["responseType"] == "slider") {
            if (parsedQuestion["validationRegex"] == "IsNumber") {
              allValues["validation"]["regex"] = "^[0-9s]*$"
            }
            allValues["validation"]["max"] = parsedQuestion.validationMax
            allValues["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : parsedQuestion.validationMin = ""
          }

        }

        allValues["fileName"] = []
        allValues["file"] = {}

        if (parsedQuestion["file"] != "NA") {

          allValues.file["required"] = gen.utils.lowerCase(parsedQuestion["fileIsRequired"])
          allValues.file["type"] = new Array
          let allowedFileUploads = this.allowedFileUploads()
          parsedQuestion["fileUploadType"].split(",").forEach(fileType => {
            if (allowedFileUploads[fileType] && allowedFileUploads[fileType] != "") {
              allValues.file.type.push(allowedFileUploads[fileType])
            }
          })

          allValues.file["minCount"] = parseInt(parsedQuestion["minFileCount"])
          allValues.file["maxCount"] = parseInt(parsedQuestion["maxFileCount"])
          allValues.file["caption"] = parsedQuestion["caption"]
        }

        allValues["questionGroup"] = parsedQuestion["questionGroup"] ? parsedQuestion["questionGroup"].split(',') : "A1"
        allValues["options"] = new Array

        // Adding data in options field
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
            allValues.options.push(eachOption)
          }
        }


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
          csvResult["_SYSTEM_ID"] = "Not Created"
          csvResult["UPLOAD_STATUS"] = "Failure"
        } else {
          resultQuestion = createQuestion
          csvResult["_SYSTEM_ID"] = createQuestion._id
          csvResult["UPLOAD_STATUS"] = "Success"

          if (parsedQuestion["parentQuestionId"] != "") {

            if (parentQuestion[parsedQuestion["parentQuestionId"]]) {
              let queryParentQuestionObject = {
                _id: parentQuestion[parsedQuestion["parentQuestionId"]]._id
              }

              let updateParentQuestionObject = {}

              updateParentQuestionObject.$push = {
                ["children"]: createQuestion._id
              }

              await database.models.questions.findOneAndUpdate(
                queryParentQuestionObject,
                updateParentQuestionObject
              )
            } else {
              csvResult["UPLOAD_STATUS"] = "Question uploaded successfully but parentQuestionId does not exists"
            }
          }

          if (parsedQuestion["instanceParentQuestionId"] != "NA") {

            if (parentQuestion[parsedQuestion["instanceParentQuestionId"]]) {
              let queryInstanceParentQuestionObject = {
                _id: parentQuestion[parsedQuestion["instanceParentQuestionId"]]._id
              }

              let updateInstanceParentQuestionObject = {}

              updateInstanceParentQuestionObject.$push = {
                ["instanceQuestions"]: createQuestion._id
              }

              await database.models.questions.findOneAndUpdate(
                queryInstanceParentQuestionObject,
                updateInstanceParentQuestionObject
              )
            } else {
              csvResult["UPLOAD_STATUS"] = "Question uploaded successfully but instanceParentQuestionId does not exists"
            }

          }

          let newCriteria = await database.models.criteria.findOne(
            {
              _id: criteriaObject[parsedQuestion["criteriaExternalId"]]._id
            },
            {
              evidences: 1
            }
          )

          let evidenceMethod = parsedQuestion["evidenceMethod"]
          let criteriaEvidences = newCriteria.evidences

          let indexOfEvidenceMethodInCriteria = criteriaEvidences.findIndex(evidence => evidence.code === evidenceMethod);

          if (indexOfEvidenceMethodInCriteria < 0) {
            evidenceCollectionMethodObject[evidenceMethod]["sections"] = new Array
            criteriaEvidences.push(evidenceCollectionMethodObject[evidenceMethod])
            indexOfEvidenceMethodInCriteria = criteriaEvidences.length - 1
          }

          let indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.findIndex(section => section.code === questionSection)

          if (indexOfSectionInEvidenceMethod < 0) {
            criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.push({ code: questionSection, questions: new Array })
            indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.length - 1
          }

          criteriaEvidences[indexOfEvidenceMethodInCriteria].sections[indexOfSectionInEvidenceMethod].questions.push(createQuestion._id)

          let queryCriteriaObject = {
            _id: newCriteria._id
          }

          let updateCriteriaObject = {}
          updateCriteriaObject.$set = {
            ["evidences"]: criteriaEvidences
          }

          await database.models.criteria.findOneAndUpdate(
            queryCriteriaObject,
            updateCriteriaObject
          )

        }

        return resolve({
          csvResult: csvResult,
          result: resultQuestion
        })

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

        if (parsedQuestion["_parentQuestionId"] == "") {
          existingQuestion.visibleIf = ""
        } else {

          let operator = parsedQuestion["parentQuestionOperator"] == "EQUALS" ? parsedQuestion["parentQuestionOperator"] = "===" : parsedQuestion["parentQuestionOperator"]

          existingQuestion.visibleIf = new Array

          existingQuestion.visibleIf.push({
            operator: operator,
            value: parsedQuestion.parentQuestionValue,
            _id: ObjectId(parsedQuestion["_parentQuestionId"])
          })

        }

        if (parsedQuestion["question0"]) {
          existingQuestion.question[0] = parsedQuestion["question0"]
        }

        if (parsedQuestion["question1"]) {
          existingQuestion.question[1] = parsedQuestion["question1"]
        }

        // if (parsedQuestion["isAGeneralQuestion"] && (parsedQuestion["isAGeneralQuestion"] == "true" || parsedQuestion["isAGeneralQuestion"] == "TRUE")) {
        //   existingQuestion["isAGeneralQuestion"] = parsedQuestion["isAGeneralQuestion"] = true
        // } else {
        //   existingQuestion["isAGeneralQuestion"] = parsedQuestion["isAGeneralQuestion"] = false
        // }

        if (parsedQuestion["responseType"] !== "") {

          existingQuestion["responseType"] = parsedQuestion["responseType"]
          existingQuestion["validation"] = {}
          existingQuestion["validation"]["required"] = this.convertStringToBoolean(gen.utils.lowerCase(parsedQuestion["validation"]))

          if (parsedQuestion["responseType"] == "matrix") {
            existingQuestion["instanceIdentifier"] = parsedQuestion["instanceIdentifier"]
          }

          if (parsedQuestion["responseType"] == "date") {
            existingQuestion["dateFormat"] = parsedQuestion.dateFormat
            existingQuestion["autoCapture"] = gen.utils.lowerCase(parsedQuestion.autoCapture)
            existingQuestion["validation"]["max"] = parsedQuestion.validationMax
            existingQuestion["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : parsedQuestion.validationMin = ""
          }

          if (parsedQuestion["responseType"] == "number") {

            existingQuestion["validation"]["IsNumber"] = gen.utils.lowerCase(parsedQuestion["validationIsNumber"])

            if (parsedQuestion["validationRegex"] == "IsNumber") {
              existingQuestion["validation"]["regex"] = "^[0-9s]*$"
            }

          }

          if (parsedQuestion["responseType"] == "slider") {
            if (parsedQuestion["validationRegex"] == "IsNumber") {
              existingQuestion["validation"]["regex"] = "^[0-9s]*$"
            }
            existingQuestion["validation"]["max"] = parsedQuestion.validationMax
            existingQuestion["validation"]["min"] = parsedQuestion.validationMin ? parsedQuestion.validationMin : ""
          }

          delete parsedQuestion["validation"]

        }

        existingQuestion["fileName"] = new Array
        existingQuestion["file"] = {}

        if (parsedQuestion["file"] != "NA") {

          existingQuestion.file["required"] = gen.utils.lowerCase(parsedQuestion["fileIsRequired"])
          existingQuestion.file["type"] = new Array
          let allowedFileUploads = this.allowedFileUploads()
          parsedQuestion["fileUploadType"].split(",").forEach(fileType => {
            if (allowedFileUploads[fileType] && allowedFileUploads[fileType] != "") {
              existingQuestion.file.type.push(allowedFileUploads[fileType])
            }
          })
          existingQuestion.file["minCount"] = parseInt(parsedQuestion["minFileCount"])
          existingQuestion.file["maxCount"] = parseInt(parsedQuestion["maxFileCount"])
          existingQuestion.file["caption"] = parsedQuestion["caption"]

          parsedQuestion["file"] = existingQuestion.file
        }

        // if (parsedQuestion["showRemarks"] && (parsedQuestion["showRemarks"] == "true" || parsedQuestion["showRemarks"] == "TRUE")) {
        //   existingQuestion["showRemarks"] = parsedQuestion["showRemarks"] = true
        // } else {
        //   existingQuestion["showRemarks"] = parsedQuestion["showRemarks"] = false
        // }


        if (parsedQuestion["questionGroup"]) {
          existingQuestion["questionGroup"] = parsedQuestion["questionGroup"] = parsedQuestion["questionGroup"].split(',')
        }

        existingQuestion["options"] = new Array

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
            existingQuestion.options.push(eachOption)
          }

        }

        Object.keys(parsedQuestion).forEach(parsedQuestionData => {
          if (!_.startsWith(parsedQuestionData, "_") && questionDataModel.includes(parsedQuestionData)) {
            if (this.booleanData().includes(parsedQuestionData)) {
              existingQuestion[parsedQuestionData] = this.convertStringToBoolean(parsedQuestion[parsedQuestionData])
            } else {
              existingQuestion[parsedQuestionData] = parsedQuestion[parsedQuestionData]
            }
            // existingQuestion[parsedQuestionData] = parsedQuestion[parsedQuestionData]
          }
        })

        let updateQuestion = await database.models.questions.findOneAndUpdate(
          { _id: existingQuestion._id },
          existingQuestion,
          { _id: 1 }
        )

        if (!updateQuestion._id) {
          parsedQuestion["UPDATE_STATUS"] = "Question Not Updated"
        } else {

          parsedQuestion["UPDATE_STATUS"] = "Success"

          if (parsedQuestion["_parentQuestionId"] != "") {

            await database.models.questions.findOneAndUpdate(
              {
                _id: parsedQuestion["_parentQuestionId"]
              },
              {
                $addToSet: {
                  ["children"]: updateQuestion._id
                }
              }, {
                _id: 1
              }
            );

          }


          if (parsedQuestion["_instanceParentQuestionId"] != "" && parsedQuestion["responseType"] != "matrix") {

            await database.models.questions.findOneAndUpdate(
              {
                _id: parsedQuestion["_instanceParentQuestionId"],
                responseType: "matrix"
              },
              {
                $addToSet: {
                  ["instanceQuestions"]: updateQuestion._id
                }
              }, {
                _id: 1
              }
            );

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

            let evidenceMethod = parsedQuestion["_evidenceMethodCode"]

            let criteriaEvidences = criteriaToUpdate.evidences
            let indexOfEvidenceMethodInCriteria = criteriaEvidences.findIndex(evidence => evidence.code === evidenceMethod);

            if (indexOfEvidenceMethodInCriteria < 0) {
              criteriaEvidences.push({
                code: evidenceMethod,
                sections: new Array
              })
              indexOfEvidenceMethodInCriteria = criteriaEvidences.length - 1
            }

            let questionSection = parsedQuestion["_sectionCode"]

            let indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.findIndex(section => section.code === questionSection)

            if (indexOfSectionInEvidenceMethod < 0) {
              criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.push({ code: questionSection, questions: new Array })
              indexOfSectionInEvidenceMethod = criteriaEvidences[indexOfEvidenceMethodInCriteria].sections.length - 1
            }

            criteriaEvidences[indexOfEvidenceMethodInCriteria].sections[indexOfSectionInEvidenceMethod].questions.push(updateQuestion._id)

            let queryCriteriaObject = {
              _id: criteriaToUpdate._id
            }

            let updateCriteriaObject = {}
            updateCriteriaObject.$set = {
              ["evidences"]: criteriaEvidences
            }

            await database.models.criteria.findOneAndUpdate(
              queryCriteriaObject,
              updateCriteriaObject
            )

          }


        }

        return resolve(parsedQuestion)

      } catch (error) {
        return reject(error);
      }
    })

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

};