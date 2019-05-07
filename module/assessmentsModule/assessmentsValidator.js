module.exports = (req) => {

    let assessment = {

        details: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('assessmentId').exists().withMessage("required assessment id")
            .isMongoId().withMessage("invalid assessment id")
        },
        list: function () {
            req.checkQuery('type').exists().withMessage("required type")
            req.checkQuery('subType').exists().withMessage("required sub type")
            req.checkQuery('status').exists().withMessage("required status")
        }

    }

    if (assessment[req.params.method]) assessment[req.params.method]();
    
};