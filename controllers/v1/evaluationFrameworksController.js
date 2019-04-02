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
        let criteriaDocument = await database.models.criterias.find({},{"name":1,"rubric.levels":1}).lean()

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

        let findQuery = {
          externalId:req.params._id
        }

        let evaluationFrameworkDocument = await database.models.evaluationFrameworks.findOne(findQuery,{themes:1,levelToScoreMapping:1,name:1}).lean()
        
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

        let generateSections = function(eachDocument){
          
          if(eachDocument.criterias){
            let tableData = new Array
            let levelObjectFromCriteria={}

            eachDocument.criterias.forEach(eachCriteria=>{
              
              Object.keys(levelValue).forEach(eachLevel=>{
                levelObjectFromCriteria[eachLevel] = criteriaObject[eachCriteria.criteriaId.toString()][eachLevel]
              })

              tableData.push(_.merge({
                criteriaName:criteriaObject[eachCriteria.criteriaId.toString()].name,
              },levelObjectFromCriteria))
              
            })
          
            let eachSection = {
              table: true,
              heading: "",
              data: tableData,
              tabularData: {
                headers: sectionHeaders
              }
            }

            responseObject.sections.push(eachSection)
          } else{
            let remainingDocument = _.omit(eachDocument,["name","label"])
            Object.keys(remainingDocument).forEach(eachValue => {
              if (eachValue != "criterias") {
                generateSections(eachDocument[eachValue])
              }
            })
          }
        }

        evaluationFrameworkDocument.themes.forEach(eachTheme=>{
          let criteriaDoc
          let themewithoutChildren = {}

          if(eachTheme.children){
            criteriaDoc = this.getCriteriaPath(eachTheme.children,eachTheme.name,eachTheme.type)
          }else{
            themewithoutChildren[eachTheme.name]={
              criterias:eachTheme.criteria,
              name:eachTheme.name,
              type:eachTheme.type
            }
            criteriaDoc =  themewithoutChildren
          }
         
         Object.keys(criteriaDoc).forEach(eachKey=>{
          let eachDoc = criteriaDoc[eachKey]
          generateSections(eachDoc)
         })
        })
        
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

  getCriteriaPath(themes,name,label) {

    if(!this.path) this.path = {}
    
    themes.forEach(theme => {
      if(typeof name == "string") {
        
        if(!this.path[name]) this.path[name] = {
          name:name,
          label:label
        }

        this.path[name][theme.name] = {
          name:theme.name,
          label:theme.label,
        }
      }
      
      else{
        name[theme.name] = {
          name:theme.name,
          label:theme.label
        }
      }

      if (theme.children) {
        this.getCriteriaPath(theme.children,this.path[name][theme.name]);
      } else{
        name[theme.name] = {
          criterias:theme.criteria
        }
      }
    })

    return this.path;
  } 
};
