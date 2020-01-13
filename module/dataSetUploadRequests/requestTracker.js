const dataSetUploadRequestsHelper = 
require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");

const requestUpdateInterval = 10000;

class RequestTracker {
  
  constructor(requestId) {
    this.documentProcessedCount = 0;
    this.requestId = requestId;
    setInterval(this.updateRequestStatus,requestUpdateInterval)
  }

  updateDocumentUpdateCount(){
    this.documentProcessedCount += 1;
  }

  getRequestId(){
    return this.requestId;
  }

  updateRequestStatus(){
    dataSetUploadRequestsHelper.updateUploadedCsvData(
        this.requestId,
        this.documentProcessedCount
    );
  }

};

module.exports = RequestTracker;
