module.exports = (req, res, next) => {

    if(req.params.controller == "assessments" ) require("../../../module/assessmentsModule/assessmentsValidator")(req);

    next();

    return

}