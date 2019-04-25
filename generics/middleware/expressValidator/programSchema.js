module.exports = (req) => {

    let programs = {

        schoolList: function () {
            req.checkQuery('programId').exists().withMessage("required program id")
            .isMongoId().withMessage("invalid program id")
            req.checkQuery('componentId').exists().withMessage("required component id")
            .isMongoId().withMessage("invalid component id")
        },
        userSchoolList: function () {
            req.checkQuery('programId').exists().withMessage("required program id")
            .isMongoId().withMessage("invalid program id")
        }

        
    }

    if (programs[req.params.method]) programs[req.params.method]();
    
};