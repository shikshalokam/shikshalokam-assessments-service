const csv = require("csvtojson");
const dataSetUploadRequestsHelper = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");

module.exports = async (req, res, next) => {
    if (req.method == "POST" && req.files && Object.keys(req.files).length > 0) {
        
        let isRequestForDataSetUpload = false;

        Object.keys(req.files).forEach(filekey => {
            if(req.files[filekey].mimetype === "text/csv") {
                isRequestForDataSetUpload = true;
            }
        })

        if(isRequestForDataSetUpload) {

            let requestedCsvFiles = Object.keys(req.files);

            for(let pointerToRequestedFile = 0; 
                pointerToRequestedFile < requestedCsvFiles.length;
                pointerToRequestedFile++
                ) {
                    
                    let existingRequestedFile = 
                    requestedCsvFiles[pointerToRequestedFile];

                    let csvData = await csv().fromString(
                        req.files[existingRequestedFile].data.toString()
                    );

                    let requesteData = {
                        url : req.url
                    }

                    requesteData["headers"] = {};
                    requesteData["headers"]["userId"] = 
                    req.headers['x-authenticated-userid'];

                    requesteData["headers"]["channelId"] = 
                    req.headers['x-channel-id'];

                    let createRequestId = 
                    await dataSetUploadRequestsHelper.create(requesteData);

                    if(createRequestId.requestId.toString()) {
                        
                        res.status(httpStatusCode.ok.status).json({
                            message: messageConstants.apiResponses.UPLOADED_REQUEST,
                            status: httpStatusCode.ok.status,
                            result: {
                                requestId : createRequestId.requestId.toString()
                            }
                        })

                        req.requestId = createRequestId.requestId;
                        req[existingRequestedFile+"Data"] = csvData;
                        req.file = existingRequestedFile;
                    }
                }
        }
    }
    next();
    return;
}

