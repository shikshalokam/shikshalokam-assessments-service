const csv = require("csvtojson");

module.exports = class assessmentsHelper {

    constructor() {
    }

    static get name() {
        return "assessmentsHelper";
    }

    async list(query, userDetails) {

        try {

            let queryObject = {};
            queryObject["type"] = query.type;
            queryObject["subType"] = query.subType;
            if (query.fromDate) queryObject["startDate"] = { $gte: new Date(query.fromDate) };
            if (query.toDate) queryObject["endDate"] = { $lte: new Date(query.toDate) };
            if (query.status) queryObject["status"] = query.status;


            let solutionDocument = await database.models.solutions.aggregate([
                {
                    $match: queryObject
                },
                {
                    $project: {
                        "externalId": "$programExternalId",
                        "_id": "$programId",
                        "name": "$programName",
                        "description": "$programDescription",
                        "assessmentId": "$_id",
                        "assessmentExternalId": "$externalId",
                        "assessmentName": "$name",
                        "assessmentDescription": "$description"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        description: { $first: "$description" },
                        externalId: { $first: "$externalId" },
                        assessments: {
                            $push: {
                                "_id": "$assessmentId",
                                "externalId": "$assessmentExternalId",
                                "name": "$assessmentName",
                                "description": "$assessmentDescription"
                            }
                        },
                    }
                },
            ]);

            return solutionDocument

        }
        catch (error) {
            throw error
        }

    }

    async details(programExternalId, assessmentId, userId, userAgent) {
        try {
            let detailedAssessment = {};

            detailedAssessment.program = await database.models.programs.findOne(
                { externalId: programExternalId },
                { 'components': 0, 'isDeleted': 0, 'updatedAt': 0, 'createdAt': 0 }
            ).lean();


            let entityProfile = await database.models.entities.findOne({ "metaInformation.userId": userId }, {
                "deleted": 0,
                "createdAt": 0,
                "updatedAt": 0,
            });

            if (!entityProfile) throw { message: "No entities found for this assessments." }

            detailedAssessment.entityProfile = {
                _id: entityProfile._id,
                entityTypeId: entityProfile.entityTypeId || "",
                entityType: entityProfile.entityType || "",
                userId: entityProfile.metaInformation.userId || "",
                name: entityProfile.metaInformation.name || "",
                externalId: entityProfile.metaInformation.externalId || ""
            }

            let solutionDocument = await database.models.solutions.findOne({ _id: assessmentId }, {
                name: 1,
                description: 1,
                externalId: 1,
                themes: 1
            }).lean();

            if (!solutionDocument) {
                let responseMessage = 'No assessments found.';
                return resolve({ status: 400, message: responseMessage })
            }

            let assessment = {};

            assessment.name = solutionDocument.name;
            assessment.description = solutionDocument.description;
            assessment.externalId = solutionDocument.externalId;

            let criteriasIdArray = gen.utils.getCriteriaIds(solutionDocument.themes);

            let submissionDocument = {
                entityId: detailedAssessment.entityProfile._id,
                entityInformation: detailedAssessment.entityProfile,
                programId: detailedAssessment.program._id,
                programExternalId: detailedAssessment.program.externalId,
                entityExternalId: detailedAssessment.entityProfile.externalId,
                programInformation: {
                    name: detailedAssessment.program.name,
                    externalId: detailedAssessment.program.externalId,
                    description: detailedAssessment.program.description,
                    owner: detailedAssessment.program.owner,
                    createdBy: detailedAssessment.program.createdBy,
                    updatedBy: detailedAssessment.program.updatedBy,
                    resourceType: detailedAssessment.program.resourceType,
                    language: detailedAssessment.program.language,
                    keywords: detailedAssessment.program.keywords,
                    concepts: detailedAssessment.program.concepts,
                    createdFor: detailedAssessment.program.createdFor,
                    imageCompression: detailedAssessment.program.imageCompression
                },
                evidenceSubmissions: [],
                status: "started"
            };
            submissionDocument.solutionId = solutionDocument._id;
            submissionDocument.solutionExternalId = solutionDocument.externalId;

            let criteriaQuestionDocument = await database.models.criteriaQuestions.find(
                { _id: { $in: criteriasIdArray } },
                {
                    resourceType: 0,
                    language: 0,
                    keywords: 0,
                    concepts: 0,
                    createdFor: 0
                }
            ).lean()

            let evidenceMethodArray = {};
            let submissionDocumentEvidences = {};
            let submissionDocumentCriterias = [];

            criteriaQuestionDocument.forEach(criteria => {
                submissionDocumentCriterias.push(
                    _.omit(criteria, [
                        "evidences"
                    ])
                );

                criteria.evidences.forEach(evidenceMethod => {
                    evidenceMethod.notApplicable = false;
                    evidenceMethod.canBeNotAllowed = true;
                    evidenceMethod.remarks = "";
                    evidenceMethod.submissions = new Array;
                    submissionDocumentEvidences[evidenceMethod.externalId] = _.omit(
                        evidenceMethod,
                        ["sections"]
                    );

                    if (!evidenceMethodArray[evidenceMethod.externalId]) {
                        evidenceMethodArray[
                            evidenceMethod.externalId
                        ] = evidenceMethod;
                    } else {
                        // Evidence method already exists
                        // Loop through all sections reading evidence method
                        evidenceMethod.sections.forEach(evidenceMethodSection => {
                            let sectionExisitsInEvidenceMethod = 0;
                            let existingSectionQuestionsArrayInEvidenceMethod = [];
                            evidenceMethodArray[
                                evidenceMethod.externalId
                            ].sections.forEach(exisitingSectionInEvidenceMethod => {
                                if (
                                    exisitingSectionInEvidenceMethod.name ==
                                    evidenceMethodSection.name
                                ) {
                                    sectionExisitsInEvidenceMethod = 1;
                                    existingSectionQuestionsArrayInEvidenceMethod =
                                        exisitingSectionInEvidenceMethod.questions;
                                }
                            });
                            if (!sectionExisitsInEvidenceMethod) {
                                evidenceMethodArray[
                                    evidenceMethod.externalId
                                ].sections.push(evidenceMethodSection);
                            } else {
                                evidenceMethodSection.questions.forEach(
                                    questionInEvidenceMethodSection => {
                                        existingSectionQuestionsArrayInEvidenceMethod.push(
                                            questionInEvidenceMethodSection
                                        );
                                    }
                                );
                            }
                        });
                    }

                });
            });

            submissionDocument.evidences = submissionDocumentEvidences;
            submissionDocument.evidencesStatus = Object.values(submissionDocumentEvidences);
            submissionDocument.criterias = submissionDocumentCriterias;
            let submissionDoc = await this.updateSubmissionAssessors(
                submissionDocument,
                userId,
                userAgent
            );
            assessment.submissionId = submissionDoc.result._id;

            const parsedAssessment = await this.parseQuestionsByIndividual(
                Object.values(evidenceMethodArray),
                submissionDoc.result.evidences,
                entityProfile.metaInformation.questionGroup
            );

            assessment.evidences = parsedAssessment.evidences;
            assessment.submissions = parsedAssessment.submissions;
            detailedAssessment['assessments'] = assessment

            return detailedAssessment;

        } catch (error) {
            throw error;

        }
    }

    async updateSubmissionAssessors(document, userId, userAgent) {

        let queryObject = {
            entityId: document.entityId,
            programId: document.programId
        };

        let projectObject = {
            assessors: 1
        }

        let submissionDocument = await database.models.submissions.findOne(
            queryObject,
            projectObject
        ).lean();

        if (!submissionDocument) {
            let entityAssessorsQueryObject = [
                {
                    $match: { userId: userId, programId: document.programId }
                }
            ];

            document.assessors = await database.models[
                "entityAssessors"
            ].aggregate(entityAssessorsQueryObject);

            let assessorElement = document.assessors.find(assessor => assessor.userId === userId)
            if (assessorElement && assessorElement.externalId != "") {
                assessorElement.assessmentStatus = "started"
                assessorElement.userAgent = userAgent
            }

            submissionDocument = await database.models.submissions.create(
                document
            );
        } else {
            let assessorElement = submissionDocument.assessors.find(assessor => assessor.userId === userId)
            if (assessorElement && assessorElement.externalId != "") {
                assessorElement.assessmentStatus = "started"
                assessorElement.userAgent = userAgent
                let updateObject = {}
                updateObject.$set = {
                    assessors: submissionDocument.assessors
                }
                submissionDocument = await database.models.submissions.findOneAndUpdate(
                    queryObject,
                    updateObject
                );
            }
        }

        return {
            message: "Submission found",
            result: submissionDocument
        };
    }

    async parseQuestionsByIndividual(evidences, submissionDocEvidences, entityQuestionGroup) {
        let sectionQuestionArray = {};
        let questionArray = {};
        let submissionsObjects = {};
        evidences.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

        evidences.forEach(evidence => {
            evidence.startTime =
                submissionDocEvidences[evidence.externalId].startTime;
            evidence.endTime = submissionDocEvidences[evidence.externalId].endTime;
            evidence.isSubmitted =
                submissionDocEvidences[evidence.externalId].isSubmitted;
            if (submissionDocEvidences[evidence.externalId].submissions) {
                submissionDocEvidences[evidence.externalId].submissions.forEach(
                    submission => {
                        if (submission.isValid) {
                            submissionsObjects[evidence.externalId] = submission;
                        }
                    }
                );
            }

            evidence.sections.forEach(section => {
                section.questions.forEach((question, index, section) => {
                    //question filter based on entity question group
                    if (!entityQuestionGroup || !entityQuestionGroup.length) entityQuestionGroup = ["A1"];
                    if (_.intersection(question.questionGroup, entityQuestionGroup).length > 0) {
                        question.evidenceMethod = evidence.externalId
                        sectionQuestionArray[question._id] = section
                        questionArray[question._id] = question
                    }
                });
            });
        });

        Object.entries(questionArray).forEach(questionArrayElm => {
            questionArrayElm[1]["payload"] = {
                criteriaId: questionArrayElm[1]["criteriaId"],
                responseType: questionArrayElm[1]["responseType"],
                evidenceMethod: questionArrayElm[1].evidenceMethod
            }
            questionArrayElm[1]["startTime"] = ""
            questionArrayElm[1]["endTime"] = ""
            delete questionArrayElm[1]["criteriaId"]

            if (questionArrayElm[1].responseType === "matrix") {
                let instanceQuestionArray = new Array()
                questionArrayElm[1].instanceQuestions.forEach(instanceQuestionId => {
                    if (sectionQuestionArray[instanceQuestionId.toString()]) {
                        let instanceQuestion = questionArray[instanceQuestionId.toString()];
                        instanceQuestionArray.push(instanceQuestion);
                        let sectionReferenceOfInstanceQuestion =
                            sectionQuestionArray[instanceQuestionId.toString()];
                        sectionReferenceOfInstanceQuestion.forEach(
                            (questionInSection, index) => {
                                if (
                                    questionInSection._id.toString() ===
                                    instanceQuestionId.toString()
                                ) {
                                    sectionReferenceOfInstanceQuestion.splice(index, 1);
                                }
                            }
                        );
                    }
                });
                questionArrayElm[1]["instanceQuestions"] = instanceQuestionArray;
            }
        });
        return {
            evidences: evidences,
            submissions: submissionsObjects,
        };
    }
}

