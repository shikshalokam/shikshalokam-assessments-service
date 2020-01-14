const requestUpdateInterval = 10000;

class RequestTracker {
  
  constructor(requestId) {
    this.documentProcessedCount = 0;
    this.requestId = requestId;
    setInterval(this.updateRequestStatus.bind(this),requestUpdateInterval);
  }

  updateDocumentProcessedCount(){
    this.documentProcessedCount += 1;
  }

  getRequestId() {
    return this.requestId;
  }

  async updateRequestStatus() {

    const dataSetUploadRequestsHelper = 
    require(MODULES_BASE_PATH + "/dataSetUploadRequests/helper");

    await dataSetUploadRequestsHelper.updateUploadedCsvData(
        this.requestId,
        this.documentProcessedCount
    );
  }

};

module.exports = RequestTracker;
