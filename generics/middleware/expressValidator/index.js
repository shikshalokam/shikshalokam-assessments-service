module.exports = (req, res, next) => {

    if(req.params.controller == "parentRegistry" ) require("./parentRegistrySchema")(req);
    if(req.params.controller == "teacherRegistry" ) require("./teacherRegistrySchema")(req);
    if(req.params.controller == "schoolLeaderRegistry" ) require("./schoolLeaderRegistrySchema")(req);
    if(req.params.controller == "programs" ) require("./programSchema")(req);
    if(req.params.controller == "assessments" ) require("./assessmentSchema")(req);
    if(req.params.controller == "schoolAssessors" ) require("./schoolAssessorSchema")(req);
    if(req.params.controller == "criterias" ) require("./criteriaSchema")(req);
    if(req.params.controller == "programOperations" ) require("./programOperationSchema")(req);
    if(req.params.controller == "insights" ) require("./insightSchema")(req);
    if(req.params.controller == "reports" ) require("./reportSchema")(req);
    if(req.params.controller == "schools") require("./schoolSchema")(req)
    if(req.params.controller == "evaluationFrameworks") require("./evaluationFrameworksSchema")
    if(req.params.controller == "assessors") require("./assessorsSchema")

    next();

    return

}