module.exports = (req) => {

    let pollSubmissionsValidator = {

        make: function () {
            req.checkParams('_id').exists().withMessage("required poll id")
            .isMongoId().withMessage("Invalid poll id");
            req.checkBody(req.body).isEmpty().withMessage("request body is missing");
        },
        report: function () {
            req.checkParams('_id').exists().withMessage("required poll id")
            .isMongoId().withMessage("Invalid poll id");
        }

    }

    if (pollSubmissionsValidator[req.params.method]) pollSubmissionsValidator[req.params.method]();

};