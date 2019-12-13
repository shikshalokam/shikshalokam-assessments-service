module.exports = (req) => {

    let dataSetUploadRequestsValidator = {

        status: function () {
            req.checkParams('_id').exists().withMessage("required request id").isMongoId().withMessage("invalid request id")
        }
        
    }

    if (dataSetUploadRequestsValidator[req.params.method]) dataSetUploadRequestsValidator[req.params.method]();

};