module.exports = (req) => {

    let insights = {

        singleEntityHighLevelReport: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('school').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        },
        singleEntityDrillDownReport: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('school').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        },
        multiEntityHighLevelReport: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('school').exists().withMessage("required school id")
        },
        multiEntityDrillDownReport: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('school').exists().withMessage("required school id")
        }
   
    }

    if (insights[req.params.method]) insights[req.params.method]();
    
};