module.exports = (req, res, next) => {
    if (req.method == "POST" && req.files && Object.keys(req.files).length > 0) {
        let isRequestForDataSetUpload = false
        Object.keys(req.files).forEach(filekey => {
            if(req.files[filekey].mimetype === "text/csv") isRequestForDataSetUpload = true
        })
        if(isRequestForDataSetUpload) {
            // Read CSV to get recordsToUploadCount, generate csvData
            
            // let entityCSVData = await csv().fromString(req.files.entities.data.toString());

            // Create a request ID

            // Send request ID to user.
            res.status(200).json({
                message: "Upload request submitted successfully.",
                status: 200,
                result: {
                    requestId : 123131231
                }
            })

            // req.data = csvData
            // req.requestId = request ID
            // req.file = ""


            controllers[req.params.version][req.params.controller][req.params.method](req);
        }
    }

    next();
    return;
}


