module.exports = (req) => {

    let schoolsAssessor = {

        insert: function () {
            req.check('externalId').exists().withMessage("invalid external id")
            req.check('userId').exists().withMessage("invalid user id")
            req.check('role').exists().withMessage("invalid role")
            req.check('programId').exists().withMessage("invalid program id")
            .isMongoId().withMessage("invalid program id")
            req.check('assessmentStatus').exists().withMessage("invalid assessment status")
            req.check('parentId').exists().withMessage("invalid parent id")
            .isMongoId().withMessage("invalid parent id")
            req.check('schools.*').isMongoId().withMessage("invalid id")
            req.check('createdBy').exists().withMessage("invalid created by")
            req.check('updatedBy').exists().withMessage("invalid updated by")
        }

    }

    if (schoolsAssessor[req.params.method]) schoolsAssessor[req.params.method]();
    
};