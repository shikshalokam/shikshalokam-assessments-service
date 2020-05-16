let table = require("cli-table");

let tableData = new table();

let enviromentVariables = {
  "HOST" : {
    "message":"Required host name",
    "optional": false
  },
  "PORT" : {
    "message" : "Required port no",
    "optional" : false
  },
  "LOG" : {
    "message" : "Required logger type",
    "optional" : false
  },
  "NODE_ENV" : {
    "message" : "Required node environment",
    "optional" : false
  },
  "ENABLE_BUNYAN_LOGGING" : {
    "message" : "Enable or disable bunyan logging",
    "optional" : false
  },
  "REQUEST_TIMEOUT_FOR_REPORTS" : {
    "message" : "Required Reports request timeout",
    "optional" : false
  },
  "APPLICATION_BASE_URL" : {
    "message" : "Required Application base url",
    "optional" : false
  },
  "MOBILE_APPLICATION_APP_TYPE" : {
    "message" : "Required mobile application app type value",
    "optional" : false
  },
  "APPLICATION_BASE_HOST" : {
    "message" : "Required Base host",
    "optional" : false
  },
  "AUTHORIZATION" : {
    "message" : "Required Server authorization code",
    "optional" : false
  },
  "CLOUD_STORAGE" : {
    "message" : "Required cloud storage provider",
    "optional" : false
  },
  "GCP_PATH" : {
    "message" : "Optional google cloud platform path",
    "optional" : true
  },
  "GCP_BUCKET_NAME" : {
    "message" : "Optional gcp bucket name",
    "optional" : true
  },
  "AZURE_ACCOUNT_NAME" : {
    "message" : "Optional azure account name",
    "optional" : true
  },
  "AZURE_ACCOUNT_KEY" : {
    "message" : "Optional azure storage account key",
    "optional" : true
  },
  "AZURE_STORAGE_CONTAINER" : {
    "message" : "Optional azure storage container name",
    "optional" : true
  },
  "AWS_ACCESS_KEY_ID" : {
    "message" : "Optional aws access key id",
    "optional" : true
  },
  "AWS_SECRET_ACCESS_KEY" : {
    "message" : "Optional aws secret access key",
    "optional" : true
  },
  "AWS_BUCKET_NAME" : {
    "message" : "Optional aws bucket name",
    "optional" : true
  },
  "AWS_BUCKET_REGION" : {
    "message" : "Optional aws bucket region",
    "optional" : true
  },
  "AWS_BUCKET_ENDPOINT" : {
    "message" : "Optional aws bucket endpoint",
    "optional" : true
  },
  "MONGODB_URL" : {
    "message" : "Required mongodb url",
    "optional" : false
  },
  "SHIKSHALOKAM_BASE_HOST" : {
    "message" : "Required shikshalokam base host",
    "optional" : false
  },
  "DB" : {
    "message" : "Required database",
    "optional" : false
  },
  "INTERNAL_ACCESS_TOKEN" : {
    "message" : "Required internal access token",
    "optional" : false
  },
  "sunbird_keycloak_auth_server_url" : {
    "message" : "Required sunbird keycloak auth server url",
    "optional" : false
  },
  "sunbird_keycloak_realm" : {
    "message" : "Required sunbird keycloak realm",
    "optional" : false
  },
  "sunbird_keycloak_client_id" : {
    "message" : "Required sunbird keycloak client id",
    "optional" : false
  },
  "sunbird_keycloak_public" : {
    "message" : "Required sunbird keycloak public",
    "optional" : false
  },
  "sunbird_cache_store" : {
    "message" : "Required sunbird cache store",
    "optional" : false
  },
  "sunbird_cache_ttl" : {
    "message" : "Required sunbird cache ttl",
    "optional" : false
  },
  "MIGRATION_COLLECTION" : {
    "message" : "Required migrations collection name",
    "optional" : false
  },
  "MIGRATION_DIR" : {
    "message" : "Required migrations directory name",
    "optional" : false
  },
  "SLACK_COMMUNICATIONS_ON_OFF" : {
    "message" : "Enable/Disable slack communications",
    "optional" : false
  },
  "SLACK_EXCEPTION_LOG_URL" : {
    "message" : "Enable/Disable slack exception log url",
    "optional" : false
  },
  "SLACK_TOKEN" : {
    "message" : "Required slack token",
    "optional" : false
  },
  "RUBRIC_ERROR_MESSAGES_TO_SLACK" : {
    "message" : "Enable/Disable rubric error message",
    "optional" : false
  },
  "CSV_REPORTS_PATH" : {
    "message" : "Required csv reports path",
    "optional" : false
  },
  "DISABLE_TOKEN_ON_OFF" : {
    "message" : "",
    "optional" : false
  },
  "DISABLE_TOKEN_CHECK_FOR_API" : {
    "message" : "Required Api endpoint for disabling token check",
    "optional" : false
  },
  "DISABLE_TOKEN_DEFAULT_USERID" : {
    "message" : "Required",
    "optional" : false
  },
  "DISABLE_TOKEN_DEFAULT_USER_ROLE" : {
    "message" : "ASSESSOR",
    "optional" : false
  },
  "DISABLE_TOKEN_DEFAULT_USER_NAME" : {
    "message" : "DISABLE_TOKEN_CHECK_DEFAULT_USER_NAME",
    "optional" : false
  },
  "DISABLE_TOKEN_DEFAULT_USER_EMAIL" : {
    "message" : "DISABLE_TOKEN_CHECK_DEFAULT_USER_EMAIL",
    "optional" : false
  },
  "DISABLE_LEARNER_SERVICE_ON_OFF" : {
    "message" : "Disable learner service",
    "optional" : false
  },
  "KAFKA_COMMUNICATIONS_ON_OFF" : {
    "message" : "Enable/Disable kafka communications",
    "optional" : false
  },
  "KAFKA_URL" : {
    "message" : "Required kafka url",
    "optional" : false
  },
  "KAFKA_GROUP_ID" : {
    "message" : "Required kafka group id",
    "optional" : false
  },
  "COMPLETED_SUBMISSION_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "INCOMPLETE_SUBMISSION_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "SUBMISSION_RATING_QUEUE_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "COMPLETED_OBSERVATION_SUBMISSION_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "INCOMPLETE_OBSERVATION_SUBMISSION_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "NOTIFICATIONS_TOPIC" : {
    "message" : "OFF/TOPIC_NAME",
    "optional" : false
  },
  "KAFKA_ERROR_MESSAGES_TO_SLACK" : {
    "message" : "ON/OFF",
    "optional" : false
  },
  "EMAIL_COMMUNICATIONS_ON_OFF" : {
    "message" : "ON/OFF",
    "optional" : false
  },
  "EMAIL_SERVICE_BASE_URL" : {
    "message" : "Required email service url",
    "optional" : false
  },
  "EMAIL_SERVICE_TOKEN" : {
    "message" : "Required email service token",
    "optional" : false
  },
  "SUBMISSION_RATING_DEFAULT_EMAIL_RECIPIENTS" : {
    "message" : "Required email recipients for submission rating",
    "optional" : false
  },
  "SHIKSHALOKAM_USER_PROFILE_FETCH_ENDPOINT" : {
    "message" : "Required user profile fetch API endpoint",
    "optional" : true
  }
}

let success = true;

module.exports = function() {
  Object.keys(enviromentVariables).forEach(eachEnvironmentVariable=>{
  
    let tableObj = {
      [eachEnvironmentVariable] : ""
    };
  
    if( !(process.env[eachEnvironmentVariable]) && !(enviromentVariables[eachEnvironmentVariable].optional)) {
      success = false;

      if(enviromentVariables[eachEnvironmentVariable] && enviromentVariables[eachEnvironmentVariable].message !== "") {
        tableObj[eachEnvironmentVariable] = 
        enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = "required";
      }
    } else {

      tableObj[eachEnvironmentVariable] = "success";
      if(enviromentVariables[eachEnvironmentVariable].optional) {
        tableObj[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].message;
      }
      
    }

    tableData.push(tableObj);
  })

  log.info(tableData.toString());

  return {
    success : success
  }
}
