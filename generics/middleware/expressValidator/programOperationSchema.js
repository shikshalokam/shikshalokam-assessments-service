module.exports = (req) => {

    let programOperationsSchema = {

        schoolReport: function () {
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        assessorReport: function () {
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        schoolSummary: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        managerProfile: function () {
            req.checkParams('_id').exists().withMessage("required program id")
        },
        reportFilters: function () {
            req.checkParams('_id').exists().withMessage("required program id")
        },
        searchSchool: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('id').exists().withMessage("required school id")
        }
   
    }

    if (programOperationsSchema[req.params.method]) programOperationsSchema[req.params.method]();
    
};