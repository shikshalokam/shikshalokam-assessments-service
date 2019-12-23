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

            let allRequestedFiles = Object.keys(req.files);

            for(let pointerToRequestedFile = 0; 
                pointerToRequestedFile<allRequestedFiles.length;
                pointerToRequestedFile++
                ) {
                    
                    let existingRequestedFile = 
                    allRequestedFiles[pointerToRequestedFile];

                    let csvData = await csv().fromString(
                        req.files[existingRequestedFile].data.toString()
                    );

                    let requesteData = {
                        url : req.url
                    }

                    requesteData["headers"] = {};
                    requesteData["headers"]["userId"] = 
                    req.headers['x-authenticated-userid'];

                    requesteData["headers"]["channelId"] = req.headers['x-channel-id'];


                    let createRequestId = 
                    await dataSetUploadRequestsHelper.create(requesteData);

                    if(createRequestId.requestId.toString()) {
                        
                        res.status(200).json({
                            message: "Uploaded request submitted successfully.",
                            status: 200,
                            result: {
                                requestId : createRequestId.requestId.toString()
                            }
                        })

                        req.requestId = createRequestId.requestId;
                        req.csvData = csvData;
                        req.file = existingRequestedFile;

                        // let splitRequestedUrl = req.url.split("/").slice(2);
                        // let version = splitRequestedUrl[0];
                        // let controller = splitRequestedUrl[1] + "Controller";
                        // let method = splitRequestedUrl[2] 

                        // controllers[version][controller][method](req);

                    }
                }
            // Read CSV to get recordsToUploadCount, generate csvData
            
            // let entityCSVData = await csv().fromString(req.files.entities.data.toString());

            // Create a request ID

            // Send request ID to user.
            // res.status(200).json({
            //     message: "Upload request submitted successfully.",
            //     status: 200,
            //     result: {
            //         requestId : 123131231
            //     }
            // })

            // req.data = csvData
            // req.requestId = request ID
            // req.file = ""


            // controllers[req.params.version][req.params.controller][req.params.method](req);
        }
    }

    next();
    return;
}


