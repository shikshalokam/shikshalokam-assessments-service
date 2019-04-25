module.exports = (req) => {

    let parentRegistry = {

        update: function () {
            req.check('studentName').exists().withMessage("invalid student name")
            req.check('grade').exists().withMessage("invalid grade")
            req.check('name').exists().withMessage("invalid name")
            req.check('gender').exists().withMessage("invalid gender")
            req.check('type').exists().withMessage("invalid type")
            req.check('typeLabel').exists().withMessage("invalid type label")
            req.check('phone1').exists().withMessage("invalid phone1")
            req.check('phone2').exists().withMessage("invalid phone2")
            req.check('address').exists().withMessage("invalid address")
            req.check('schoolId').exists().withMessage("invalid school id")
            req.check('schoolName').exists().withMessage("invalid school name")
            req.check('programId').exists().withMessage("invalid program id name")
            req.checkParams('_id').exists().withMessage("required parent registry id")
            .isMongoId().withMessage("invalid parent registry id")
        },
        add: function () {
            req.check('parents.*.studentName').exists().withMessage("invalid student name")
            req.check('parents.*.grade').exists().withMessage("invalid grade")
            req.check('parents.*.name').exists().withMessage("invalid name")
            req.check('parents.*.gender').exists().withMessage("invalid gender")
            req.check('parents.*.type').exists().withMessage("invalid type")
            req.check('parents.*.typeLabel').optional().withMessage("invalid type label")
            req.check('parents.*.phone1').exists().withMessage("invalid phone1")
            req.check('parents.*.phone2').exists().withMessage("invalid phone2")
            req.check('parents.*.address').exists().withMessage("invalid address")
            req.check('parents.*.schoolId').exists().withMessage("invalid school id")
            req.check('parents.*.schoolName').exists().withMessage("invalid school name")
            req.check('parents.*.programId').exists().withMessage("invalid program id name")
        },
        fetch: function () {
            req.checkParams('_id').exists().exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        },
        list: function () {
            req.checkParams('_id').exists().withMessage("required school id")
            .isMongoId().withMessage("invalid school id")
        }

        
    }

    if (parentRegistry[req.params.method]) parentRegistry[req.params.method]();
    
};