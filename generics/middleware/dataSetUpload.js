const csv = require("csvtojson");
const fs = require('fs');
const dataSetUploadRequestsHelper = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");
const moment = require("moment-timezone");

module.exports = async (req, res, next) => {
    if (req.method == "POST" && req.files && Object.keys(req.files).length > 0) {
        
        let isRequestForDataSetUpload = false;

        Object.keys(req.files).forEach(filekey => {
            if(req.files[filekey].mimetype === "text/csv") {
                isRequestForDataSetUpload = true;
            }
        })

        if(isRequestForDataSetUpload) {

            const filePath = `${process.env.DATASET_UPLOAD_PATH}/${moment(new Date()).tz("Asia/Kolkata").format("YYYY_MM_DD")}/`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }

            let requestedCsvFiles = Object.keys(req.files);

            for(let pointerToRequestedFile = 0; 
                pointerToRequestedFile < requestedCsvFiles.length;
                pointerToRequestedFile++
                ) {
                    
                    let existingRequestedFile = 
                    requestedCsvFiles[pointerToRequestedFile];

                    let file = filePath +req.files[existingRequestedFile].name;
                    file = file.replace(".csv","")+"_"+moment(new Date()).tz("Asia/Kolkata").format("YYYY_MM_DD_HH_mm") + ".csv";
                    fs.writeFileSync(file, req.files[existingRequestedFile].data);

                    let headerSequence;
                    let csvData = await csv().fromString(
                        req.files[existingRequestedFile].data.toString()
                    ).on('header', (headers) => { headerSequence = headers });

                    let requestedFilePath = 
                    global.BASE_HOST_URL + file.replace("./","");

                    let requesteData = {
                        url : req.url,
                        headers : req.headers,
                        totalSize : csvData.length,
                        requestedFilePath : requestedFilePath
                    }

                    let requestTracker = 
                    await dataSetUploadRequestsHelper.create(requesteData);

                    if(requestTracker.getRequestId()) {
                        
                        res.status(httpStatusCode.ok.status).json({
                            message: messageConstants.apiResponses.UPLOADED_REQUEST,
                            status: httpStatusCode.ok.status,
                            result: {
                                requestId : requestTracker.getRequestId()
                            }
                        })

                        req.requestId = requestTracker.getRequestId();
                        req.requestTracker = requestTracker;
                        req[existingRequestedFile+"Data"] = csvData;
                        req[existingRequestedFile+"DataSize"] = csvData.length;
                        req.file = existingRequestedFile;
                        req[existingRequestedFile+"Header"] = headerSequence;
                    }
                }
        }
    }
    next();
    return;
}

