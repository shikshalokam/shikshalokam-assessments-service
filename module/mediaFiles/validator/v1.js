module.exports = (req) => {

    let mediaFilesValidator = {

        list: function () {
        }
    }

    if (mediaFilesValidator[req.params.method]) mediaFilesValidator[req.params.method]();
};