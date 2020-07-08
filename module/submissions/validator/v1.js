module.exports = (req) => {

    let submissionValidator = {

        pushCompletedSubmissionForReporting: function () {
            req.checkParams('_id').exists().withMessage("required submission id")
        },

        pushIncompleteSubmissionForReporting: function () {
            req.checkParams('_id').exists().withMessage("required submission id")
        },
        delete : function () {
            req.checkParams('_id').exists().withMessage("required submission id");
        },
        title : function () {
            req.checkParams('_id').exists().withMessage("required submission id");
            req.checkBody('title').exists().withMessage("required title");
        },
        create : function () {
            req.checkParams('_id').exists().withMessage("required solution id");
            req.checkQuery('entityId').exists().withMessage("required entityId");
        },
        list: function () {
            req.checkParams('_id').exists().withMessage("required solution id")
            .isMongoId().withMessage("Invalid solution id");
            req.checkQuery('entityId').exists().withMessage("required entity id")
            .isMongoId().withMessage("Invalid entity id");
        }   
    }

    if (submissionValidator[req.params.method]) submissionValidator[req.params.method]();

};