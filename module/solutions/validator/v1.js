module.exports = (req) => {

    let solutionValidator = {
        uploadThemes: function () {
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        update: function () {
            req.checkQuery('solutionExternalId').exists().withMessage("required solution externalId");
        },
        questionList: function () {
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        details: function () {
            req.checkParams('_id').exists().withMessage("required solution id");
        },
        importFromSolution: function () {
            req.checkQuery('solutionId').exists().withMessage("required solution externalId");
            req.checkBody('externalId').exists().withMessage("required new solution externalId")
            req.checkBody('name').exists().withMessage("required new solution name")
            req.checkBody('description').exists().withMessage("required new solution description")
            req.checkBody('programExternalId').exists().withMessage("required programExternalId")
        },
        metaForm : function () {
            req.checkQuery('type').exists().withMessage("required solution type");
        },
        make : function () {
            req.checkParams("_id").exists().withMessage("Solution template id is required");
            req.checkBody("formData").exists().withMessage("Form data is required");
            req.checkQuery("type").exists().withMessage("Required type of solution");
        },
        templates : function () {
            req.checkQuery('type').exists().withMessage("required type");
        },
        templateDetails : function () {
            req.checkQuery('solutionId').exists().withMessage("solutionId is required");
        }
    }

    if (solutionValidator[req.params.method]) solutionValidator[req.params.method]();

};