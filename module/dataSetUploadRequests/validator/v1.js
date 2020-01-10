module.exports = (req) => {

    let requestValidator = {

        status: function () {
            req.checkParams('_id').exists().withMessage("required request id")
        }
    }

    if (requestValidator[req.params.method]) {
        requestValidator[req.params.method]();
    }

};