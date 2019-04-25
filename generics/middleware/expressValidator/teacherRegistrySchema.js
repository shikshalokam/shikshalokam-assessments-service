module.exports = (req) => {

    let teacherRegistry = {

        update: function () {
            req.check('name').exists().withMessage("invalid name")
            req.check('qualifications').exists().withMessage("invalid qualifications")
            req.check('yearsOfExperience').exists().withMessage("invalid years of experience")
            req.check('yearsInCurrentSchool').exists().withMessage("invalid years in current school")
            req.check('schoolId').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
            req.check('schoolName').exists().withMessage("invalid school name")
            req.check('programId').exists().withMessage("required program id")
            .isMongoId().withMessage("invalid program id")
            req.checkParams('_id').exists().withMessage("required teacher registry id")
            .isMongoId().withMessage("invalid teacher registry id")
        },
        add: function () {
            req.check('teachers.*.name').exists().withMessage("invalid name")
            req.check('teachers.*.qualifications').exists().withMessage("invalid qualifications")
            req.check('teachers.*.yearsOfExperience').exists().withMessage("invalid years of experience")
            req.check('teachers.*.yearsInCurrentSchool').exists().withMessage("invalid years in current school")
            req.check('teachers.*.schoolId').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
            req.check('teachers.*.schoolName').exists().withMessage("invalid school name")
            req.check('teachers.*.programId').exists().withMessage("required program id")
            .isMongoId().withMessage("invalid program id")
        },
        fetch: function () {
            req.checkParams('_id').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        },
        list: function () {
            req.checkParams('_id').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        }

        
    }

    if (teacherRegistry[req.params.method]) teacherRegistry[req.params.method]();
    
};