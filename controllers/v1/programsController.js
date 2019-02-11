module.exports = class Programs extends Abstract {
  constructor() {
    super(programsSchema);
  }

  static get name() {
    return "programs";
  }

  find(req) {
    return super.find(req);
  }

  async list(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let programDocument = await database.models.programs.aggregate([
          // { "$addFields": { "assessmentObjectId": "$components.id" } },
          {
            $lookup: {
              from: "evaluationFrameworks",
              localField: "components.id",
              foreignField: "_id",
              as: "assessments"
            }
          },
          {
            $project: {
              externalId: 1,
              name: 1,
              description: 1,
              "assessments._id": 1,
              "assessments.externalId": 1,
              "assessments.name": 1,
              "assessments.description": 1
            }
          }
        ])

        if (!programDocument) {
          return reject({
            status: 404,
            message: "No programs data"
          })
        }

        let responseMessage = "Program information list fetched successfully."

        let response = { message: responseMessage, result: programDocument };

        return resolve(response);

      }
      catch (error) {
        return reject({ message: error });
      }
    })

  }

  // async programDocument(programIds = "all", fields = "all") {
  //   let queryObject = {}

  //   if (programIds != "all") {
  //     queryObject = {
  //       _id: {
  //         $in: programIds
  //       }
  //     }
  //   }

  //   let projectionObject = {}

  //   if (fields != "all") {
  //     fields.forEach(element => {
  //       projectionObject[element] = 1
  //     });
  //   }

  //   let programDocuments = await database.models.programs.find(queryObject, projectionObject)
  //   return programDocuments
  // }

  async programDocument(programIds = "all", fields = "all", pageIndex = "all", pageSize = "all") {
    let queryObject = {}

    if (programIds != "all") {
      queryObject = {
        _id: {
          $in: programIds
        }
      }
    }

    let projectionObject = {}

    if (fields != "all") {
      fields.forEach(element => {
        projectionObject[element] = 1
      });
    }

    let pageIndexValue = 0;
    let limitingValue = 0;

    if (pageIndex != "all" && pageSize !== "all") {
      pageIndexValue = (pageIndex - 1) * pageSize;
      limitingValue = pageSize;
    }

    // if (search !== "all") {

    // }

    let programDocuments = await database.models.programs.find(queryObject, projectionObject).skip(pageIndexValue).limit(limitingValue)
    return programDocuments
  }

  async schoolList(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let pageIndexValue = 0;
        let limitingValue = 0;
        let pageIndex = req.query.pageIndex;
        let pageSize = req.query.pageSize;
        let programId = req.query.programId

        if (!programId) {
          throw "Program id is missing"
        }

        let componentId = req.query.componentId

        if (!componentId) {
          throw "Component Id is missing"
        }

        if (pageIndex != 0 && pageSize !== 0) {
          pageIndexValue = parseInt((pageIndex - 1) * pageSize);
          limitingValue = parseInt(pageSize);
        }

        let programDocument = await database.models.programs.aggregate([
          {
            $match: {
              _id: ObjectId(programId)
            }
          },
          {
            $unwind: "$components"
          }, {
            $match: {
              "components.id": ObjectId(componentId)
            }
          },
          {
            $lookup: {
              from: "schools",
              "let": {
                "schoolId": "$_id"
              },
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$eq": ["$components.schools", "$schoolId"]
                    }
                  }
                },
                { "$skip": pageIndexValue },
                { "$limit": limitingValue },
              ],
              "as": "schoolInformation"
            },
          },
          {
            $project: {
              "programId": "$_id",
              "schoolInformation._id": 1,
              "schoolInformation.externalId": 1,
              "schoolInformation.name": 1,
              "_id": 0
            }
          },
        ])

        if (!programDocument) {
          throw "Bad request"
        }

        return resolve({ message: "List of schools fetched successfully", result: programDocument[0].schoolInformation })
      }
      catch (error) {
        return reject({
          status: 400,
          message: error
        })
      }
    })
  }

  async userList(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let programId = req.query.programId

        if (!programId) {
          throw "Program id is missing"
        }

        let componentId = req.query.componentId

        if (!componentId) {
          throw "Component id is missing"
        }

        let programDocument = await database.models.programs.aggregate([
          {
            $match: {
              _id: ObjectId(programId)
            }
          }, {
            $unwind: "$components"
          }, {
            $match: {
              "components.id": ObjectId(componentId)
            }
          }, {
            "$addFields": { "schoolIdInObjectIdForm": "$components.schools" }
          },
          {
            $lookup: {
              from: "schoolAssessors",
              localField: "schoolIdInObjectIdForm",
              foreignField: "schools",
              as: "assessorInformation"
            }
          },
          {
            $project: {
              "assessorInformation.schools": 0,
              "assessorInformation.deleted": 0
            }
          }
        ])

        if (!programDocument) {
          throw "Bad request"
        }

        return resolve({
          message: "List of assessors fetched successfully",
          result: programDocument[0].assessorInformation
        })

      }
      catch (error) {
        return reject({
          status: 400,
          message: error
        })
      }
    })
  }

};
