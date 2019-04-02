module.exports = class EvaluationFrameworks extends Abstract {
  constructor() {
    super(evaluationFrameworksSchema);
  }

  static get name() {
    return "evaluationFrameworks";
  }

  find(req) {
    return super.find(req);
  }

  findOne(req) {
    return super.findOne(req);
  }

  findById(req) {
    return super.findById(req);
  }

  async evaluationFrameworkDocument(evaluationIds = "all", fields = "all") {

    let queryObject = {}

    if (evaluationIds != "all") {
      queryObject = {
        _id: {
          $in: evaluationIds
        }
      }
    }


    let projectionObject = {}

    if (fields != "all") {
      fields.forEach(element => {
        projectionObject[element] = 1
      });
    }

    let evaluationFrameworkDocuments = await database.models["evaluationFrameworks"].find(queryObject, projectionObject);
    return evaluationFrameworkDocuments
  }

  async details(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let findQuery = {
          _id:req.params._id
        }

        let evaluationFrameworkDocument = await database.models.evaluationFrameworks.findOne(findQuery,{themes:1,levelToScoreMapping:1,name:1}).lean()
        
        let criteriasIdArray = gen.utils.getCriteriaIds(evaluationFrameworkDocument.themes);
        let criteriaDocument = await database.models.criterias.find({_id: { $in: criteriasIdArray } },{"name":1,"rubric.levels":1}).lean()

        let criteriaObject = {}

        criteriaDocument.forEach(eachCriteria=>{
          let levelsDescription = {}
          
          for(let k in eachCriteria.rubric.levels){
            levelsDescription[k] = eachCriteria.rubric.levels[k].description
          }

          criteriaObject[eachCriteria._id.toString()] =_.merge({
            name:eachCriteria.name
          },levelsDescription) 
        })

        let responseObject = {}
        responseObject.heading = "Framework + rubric api for - "+evaluationFrameworkDocument.name
        responseObject.summary = [
          {
           name:"",
           title:"" 
          }
        ]

        responseObject.sections = new Array

        let levelValue = {}

        let sectionHeaders = new Array
        
        let criteriaNameObject = {
          key:"criteriaName",
          value:"Domain"
        }

        sectionHeaders.push(criteriaNameObject)

        for(let k in evaluationFrameworkDocument.levelToScoreMapping){
          levelValue[k]=""
          sectionHeaders.push({name: k,value:evaluationFrameworkDocument.levelToScoreMapping[k].label})
        }

        let count = 0

        let generateCriteriaThemes =  function (themes,parentData = []) {
        
          themes.forEach(theme => {
            if (theme.children) {  
              let hierarchyTrackToUpdate = [...parentData]
              hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]))
  
              generateCriteriaThemes(theme.children,hierarchyTrackToUpdate)
            } else {
              
              let tableData = new Array
              let levelObjectFromCriteria={}
  
              let hierarchyTrackToUpdate = [...parentData]
              hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]))

              theme.criteria.forEach(criteria => {

                if(criteriaObject[criteria.criteriaId.toString()]) {
                  
                  Object.keys(levelValue).forEach(eachLevel=>{
                    levelObjectFromCriteria[eachLevel] = criteriaObject[criteria.criteriaId.toString()][eachLevel]
                  })
                  
                  tableData.push(_.merge({
                    criteriaName:criteriaObject[criteria.criteriaId.toString()].name,
                  },levelObjectFromCriteria))
                }

              })
              let eachSection = {
                table: true,
                data: tableData,
                tabularData: {
                headers: sectionHeaders
              },
              summary:hierarchyTrackToUpdate
              }
              console.log("Count",++count)
              responseObject.sections.push(eachSection)
            }
          })
  
        }

        generateCriteriaThemes(evaluationFrameworkDocument.themes)
        
        let response = {
          message: "Framework + rubric api fetched successfully.",
          result: responseObject
        };

        return resolve(response);
      } catch (error) {
        return reject({
          status: 500,
          message: error,
          errorObject: error
        });
      }
    });
  }
};
