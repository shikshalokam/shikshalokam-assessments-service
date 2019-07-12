const submissionsHelper = require(ROOT_PATH + "/module/submissions/helper")
const observationsHelper = require(ROOT_PATH + "/module/observationSubmissions/helper")

module.exports = class ObservationSubmissions extends Abstract {

  constructor() {
    super(observationSubmissionsSchema);
  }

  static get name() {
    return "observationSubmissions";
  }
  /**
* @api {post} /assessment/api/v1/observationSubmissions/make/{{submissionId}} create observation submission
* @apiVersion 0.0.1
* @apiName create observation submission
* @apiGroup ObservationSubmissions
* @apiParamExample {json} Request-Body:
* {
* 	"evidence": {
*                   "externalId" : "",
*                   "answers" : {
*                       "5be442149a14ba4b5038dce4" : {
*                           "qid" : "",
*                           "responseType":"",
*                           "value" : [ 
*                               {
*                                   "5be442dd9a14ba4b5038dce5" : {
*                                       "qid" : "",
*                                       "value" : "",
*                                       "remarks" : "",
*                                       "fileName" : [],
*                                       "payload" : {
*                                           "question" : [ 
*                                               "", 
*                                               ""
*                                           ],
*                                           "labels" : [ 
*                                               ""
*                                           ],
*                                           "responseType" : ""
*                                       },
*                                       "criteriaId" : ""
*                                   },
*                                   "5be52f5d9a14ba4b5038dd0c" : {
*                                       "qid" : "",
*                                       "value" : [ 
*                                           "String", 
*                                           "String"
*                                       ],
*                                       "remarks" : "",
*                                       "fileName" : [],
*                                       "payload" : {
*                                           "question" : [ 
*                                               "", 
*                                               ""
*                                           ],
*                                           "labels" : [ 
*                                              "String", 
*                                           "String"
*                                           ],
*                                           "responseType" : """
*                                       },
*                                       "criteriaId" : ""
*                                   }
*                               }
*                           ],
*                           "remarks" : "",
*                           "fileName" : [],
*                           "payload" : {
*                               "question" : [ 
*                                   "String"", 
*                                   "Stgring"
*                               ],
*                              "labels" : [ 
*                                   [ 
*                                       [ 
*                                           {
*                                               "_id" : "",
*                                               "question" : [ 
*                                                   "String", 
*                                                   "String"
*                                               ],
*                                               "options" : [ 
*                                                   {
*                                                       "value" : "",
*                                                       "label" : ""
*                                                   }
*                                               ],
*                                               "children" : [],
*                                               "questionGroup" : [ 
*                                                   ""
*                                               ],
*                                               "fileName" : [],
*                                               "instanceQuestions" : [],
*                                               "deleted" : Boolean,
*                                               "tip" : "",
*                                               "externalId" : "",
*                                               "visibleIf" : "",
*                                               "file" : "",
*                                               "responseType" : "",
*                                               "validation" : {
*                                                   "required" : Boolean
*                                               },
*                                               "showRemarks" : Boolean,
*                                               "isCompleted" : Boolean,
*                                               "remarks" : "",
*                                               "value" : "",
*                                               "canBeNotApplicable" : "Boolean",
*                                               "usedForScoring" : "",
*                                               "modeOfCollection" : "",
*                                               "questionType" : "",
*                                               "accessibility" : "",
*                                               "updatedAt" : "Date",
*                                               "createdAt" : "Date",
*                                               "__v" : 0,
*                                               "payload" : {
*                                                   "criteriaId" : ""
*                                               }
*                                           }, 
*                                           {
*                                               "_id" : "",
*                                               "question" : [ 
*                                                   "String", 
*                                                   "String"
*                                               ],
*                                               "options" : [ 
*                                                   {
*                                                       "value" : "",
*                                                       "label" : ""
*                                                   }
*                                               ],
*                                               "children" : [],
*                                               "questionGroup" : [ 
*                                                   "String"
*                                               ],
*                                               "fileName" : [],
*                                               "instanceQuestions" : [],
*                                               "deleted" : Boolean,
*                                               "tip" : "",
*                                               "externalId" : "",
*                                               "visibleIf" : "",
*                                               "file" : "",
*                                               "responseType" : "",
*                                               "validation" : {
*                                                   "required" : Boolean
*                                               },
*                                               "showRemarks" : Boolean,
*                                               "isCompleted" : Boolean,
*                                               "remarks" : "",
*                                               "value" : "",
*                                               "canBeNotApplicable" : "Boolean",
*                                               "usedForScoring" : "",
*                                               "modeOfCollection" : "",
*                                               "questionType" : "",
*                                               "accessibility" : "",
*                                               "updatedAt" : "Date",
*                                               "createdAt" : "Date",
*                                               "__v" : 0,
*                                               "payload" : {
*                                                   "criteriaId" : ""
*                                               }
*                                           }
*                                       ], 
*                                   ]
*                               ],
*                               "responseType" : ""
*                           },
*                           "criteriaId" : ""
*                       }
*                   },
*                   "startTime" : Date,
*                   "endTime" : Date,
*                   "gpsLocation" : "String,String",
*                   "submittedBy" : """,
*                   "isValid" : Boolean
*               }
* }
* @apiUse successBody
* @apiUse errorBody
*/

  async make(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let response = await submissionsHelper.createEvidencesInSubmission(req, "observationSubmissions", false);

        return resolve(response);

      } catch (error) {

        return reject({
          status: 500,
          message: "Oops! Something went wrong!",
          errorObject: error
        });

      }

    })
  }

  /**
* @api {get} /assessment/api/v1/observationSubmissions/isAllowed/:observationSubmissionId?evidenceId="LW" check submissions status 
* @apiVersion 0.0.1
* @apiName check submissions status 
* @apiGroup ObservationSubmissions
* @apiParam {String} evidenceId Evidence ID.
* @apiUse successBody
* @apiUse errorBody
*/

  async isAllowed(req) {
    return new Promise(async (resolve, reject) => {

      try {

        let result = {
          allowed: true
        }

        let message = "Observation submission check completed successfully";

        let submissionDocument = await database.models.observationSubmissions.findOne(
          { "_id": req.params._id },
          {
            ["evidences." + req.query.evidenceId + ".isSubmitted"]: 1,
            ["evidences." + req.query.evidenceId + ".submissions"]: 1
          }
        );

        if (!submissionDocument || !submissionDocument._id) {
          throw "Couldn't find the submission document"
        } else {
          if (submissionDocument.evidences[req.query.evidenceId].isSubmitted && submissionDocument.evidences[req.query.evidenceId].isSubmitted == true) {
            submissionDocument.evidences[req.query.evidenceId].submissions.forEach(submission => {
              if (submission.submittedBy == req.userDetails.userId) {
                result.allowed = false
              }
            })
          }
        }

        let response = {
          message: message,
          result: result
        };

        return resolve(response);

      } catch (error) {
        return reject({
          status: 500,
          message: error,
          errorObject: error
        });
      }

    })
  }

  async makePdf(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let observationSubmissionsDocument = await database.models.observationSubmissions.findOne({
          entityId: req.params._id,
          status: "completed"
        }, {
            "entityInformation.name": 1,
            "entityInformation.schoolName": 1,
            "observationInformation.name": 1,
            "observationInformation.createdBy": 1,
            "answers": 1,
            "solutionExternalId": 1
          }).lean()

        let solutionData = await database.models.solutions.findOne({
          externalId: observationSubmissionsDocument.solutionExternalId
        }, { themes: 1 }).lean()

        let criteriaIds = gen.utils.getCriteriaIds(solutionData.themes);

        let allCriteriaDocument = await database.models.criteria.find({ _id: { $in: criteriaIds } }, { evidences: 1 }).lean();
        let questionIds = gen.utils.getAllQuestionId(allCriteriaDocument)

        let questionDocument = await database.models.questions.find({
          _id: { $in: questionIds }
        }, { options: 1 }).lean();

        let questionData = questionDocument.reduce((acc, currentData) => {
          if (currentData.options && currentData.options.length > 0) {
            acc[currentData._id.toString()] = {
              questionOptions: currentData.options
            }
          }
          return acc
          // console.log(currentData)
        }, {})


        let observations = []

        observations.push({
          "textName": "General Information",
          "School Name": observationSubmissionsDocument.entityInformation.schoolName,
          "Observation Name": observationSubmissionsDocument.observationInformation.name,
          "Assessors Name": observationSubmissionsDocument.observationInformation.createdBy,
          "Entity Name": observationSubmissionsDocument.entityInformation.name
        })

        let pdfData = {}
        pdfData["header"] = {}
        pdfData["header"]["margin"] = 10
        pdfData["header"]["columns"] = []
        pdfData["header"]["columns"].push({
          image: ROOT_PATH + '/roboto/shikshalokam.png',
          width: 30,
          marginLeft: 10
        },
          {
            margin: [10, 0, 0, 0],
            text: 'Here goes the rest'
          }
        )
        pdfData["footer"] = {}

        pdfData.footer = function (currentPage, pageCount) {
          return {
            margin: 10,
            columns: [
              {
                fontSize: 9,
                text: [
                  {
                    text: '--------------------------------------------------------------------------' +
                      '\n',
                    margin: [0, 20]
                  },
                  {
                    text: '© shikshalokam,' + currentPage.toString() + ' of ' + pageCount,
                  }
                ],
                alignment: 'center'
              }
            ]
          };

        }

        pdfData["content"] = []
        pdfData["styles"] = {}

        let TextAnswer = {}
        TextAnswer["ol"] = []

        pdfData["styles"]["tableExample"] = {
          borderRadius: 4,
          fillColor: '#b0b6bf',
          dontBreakRows: true,
          fontSize: 15,
          margin: [10, 10, 10, 10]
        }

        let generalInformation = {}

        let tableData = {
          style: ['tableExample'],
          table: {
            "headerRows": 0,
            // widths: ['50%', '50%'],
            body: []
          }
        }

        let textAnswer = JSON.parse(JSON.stringify(tableData))
        let generalInformationTable = JSON.parse(JSON.stringify(tableData))

        for (let pointerToObservations = 0; pointerToObservations < observations.length; pointerToObservations++) {
          generalInformationTable["table"]["widths"] = ['50%', '50%']
          generalInformation["text"] = observations[pointerToObservations].textName;
          generalInformation["fontSize"] = 18;
          generalInformation["background"] = "gray";
          generalInformation["width"] = "auto";
          generalInformation["fillColor"] = "#dedede";

          if (observations[pointerToObservations].textName === "General Information") {

            Object.keys(observations[pointerToObservations]).forEach(eachObservation => {
              generalInformationTable.table.body.push([
                {
                  text: eachObservation,
                  margin: 8
                }, {
                  text: observations[pointerToObservations][eachObservation],
                  margin: 8
                }
              ])
            })
          }

          generalInformationTable["layout"] = {
            hLineColor: function (i, node) {
              console.log(node.table)
              console.log(i)
              return (i === 0 || i === node.table.body.length) ? "black" : "#b0b6bf";
            },

            vLineColor: function (i, node) {
              console.log(node.table)
              console.log(i)
              console.log(i.widths)

              return (i === 0 || i === node.table.widths.length) ? "black" : "#b0b6bf";
            }
          }

          pdfData["content"].push(generalInformation, generalInformationTable)

        }

        let answerDocument = Object.values(observationSubmissionsDocument.answers)

        for (let pointerToAnswer = 0; pointerToAnswer < answerDocument.length; pointerToAnswer++) {

          if (answerDocument[pointerToAnswer].responseType === "text") {


            TextAnswer.ol.push(
              { text: `Q.NO${pointerToAnswer + 1} ${answerDocument[pointerToAnswer].payload.question[0]}`, listType: 'none' },
              {
                ul: [
                  `${answerDocument[pointerToAnswer].payload.labels[0]}`
                ]
              }
            )
            textAnswer["table"]["widths"] = ['100%']

            textAnswer.table.body.push([TextAnswer])

            textAnswer["layout"] = {
              hLineColor: function (i, node) {
                console.log(node.table)
                console.log(i)
                return (i === 0 || i === node.table.body.length) ? "black" : "#b0b6bf";
              },

              vLineColor: function (i, node) {
                console.log(node.table)
                console.log(i)
                console.log(i.widths)

                return (i === 0 || i === node.table.widths.length) ? "black" : "#b0b6bf";
              }
            }
          }
        }

        if (TextAnswer.ol.length > 0) {
          pdfData["content"].push({
            "text": "Text",
            "fontSize": 18,
            "background": "gray",
            "width": "auto",
            "fillColor": "#dedede",
          }, textAnswer)
        }

        let generatePdf = observationsHelper.generatePdf(pdfData)
        console.log("here")
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
