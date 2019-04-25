module.exports = (req) => {

    let reports = {

        status: function () {
            req.checkParams('_id').exists().withMessage("required program id")
        },
        generateEcmReportByDate: function () {
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('schoolId').exists().withMessage("required school id")
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        generateSubmissionReportsBySchoolId: function () {
            req.checkQuery('schoolId').exists().withMessage("required school id")
        },
        generateCriteriasBySchoolId: function () {
            req.checkQuery('schoolId').exists().withMessage("required school id")
        }
   
    }

    if (reports[req.params.method]) reports[req.params.method]();
    
};