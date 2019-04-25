module.exports = (req) => {

    let schools = {

        assessments: function () {
            req.checkParams('_id').exists().withMessage("required program id")
        }

    }

    if (schools[req.params.method]) schools[req.params.method]();
    
};