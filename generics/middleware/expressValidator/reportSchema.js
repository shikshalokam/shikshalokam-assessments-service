module.exports = (req) => {

    let reports = {

        status: function () {
            req.checkParams('_id').exists().withMessage("required program id")
        },
        assessorSchools:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        schoolAssessors:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        programSchoolsStatus:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        programsSubmissionStatus:function(){
            req.checkParams('_id').exists().withMessage("required program id")
            req.checkQuery('evidenceId').exists().withMessage("required ecm data")
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
        },
        parentRegistry:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        teacherRegistry:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        schoolLeaderRegistry:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        schoolProfileInformation:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        submissionFeedback:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        ecmSubmissionByDate:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        },
        completedParentInterviewsByDate:function(){
            req.checkParams('_id').exists().withMessage('required program id')
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        parentInterviewCallResponseByDate:function(){
            req.checkParams('_id').exists().withMessage('required program id')
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        parentInterviewCallDidNotPickupReportByDate:function(){
            req.checkParams('_id').exists().withMessage('required program id')
            req.checkQuery('fromDate').exists().withMessage("required from date")
        },
        schoolList:function(){
            req.checkParams('_id').exists().withMessage('required program id')
            req.checkQuery('componentId').exists().withMessage("required component id")
        },
        teacherRegistry:function(){
            req.checkParams('_id').exists().withMessage('required program id')
        }

    }

    if (reports[req.params.method]) reports[req.params.method]();
    
};