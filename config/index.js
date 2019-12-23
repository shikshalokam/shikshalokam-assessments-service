/**
 * Project          : Shikshalokam-Assessment
 * Module           : Configuration
 * Source filename  : index.js
 * Description      : Environment related configuration variables
 * Copyright        : Copyright © 2018
 *                    Written under contract by Above Solutions Pvt. Ltd.
 * Author           : Yogesh Sinoriya <yogesh.sinoriya@above-inc.com>
 */

let db_connect = function(configData) {
  global.database = require("./dbConfig")(
    configData.DB_Config.connection.mongodb
  );
  global.ObjectId = database.ObjectId;
  global.Abstract = require("../generics/abstract");
};


let kafka_connect = function(configData) {
  global.kafkaClient = require("./kafkaConfig")(
    configData.Kafka_Config
  );
};

const configuration = {
  root: require("path").normalize(__dirname + "/.."),
  app: {
    name: process.env.DEFAULT_APP_NAME
  },
  host: process.env.HOST || process.env.DEFAULT_HOST,
  port: process.env.PORT || process.env.DEFAULT_PORT,
  log: process.env.LOG || process.env.DEFAULT_LOG,
  DB_Config: {
    connection: {
      mongodb: {
        host: process.env.MONGODB_URL || process.env.DEFAULT_MONGODB_HOST ,
        user: "",
        pass: "",
        database: process.env.DB || process.env.DEFAULT_MONGODB_DATABASE,
        options: {
          useNewUrlParser: true
        }
      }
    },
    plugins: {
      timestamps: true,
      elasticSearch: false,
      softDelete: true,
      autoPopulate: false,
      timestamps_fields: {
        createdAt: process.env.DEFAULT_CREATED_AT,
        updatedAt: process.env.DEFAULT_UPDATED_AT
      }
    }
  },
  Kafka_Config: {
    host: process.env.KAFKA_URL || process.env.DEFAULT_KAFKA_URL,
    consumerTopics: {
      submissionRatingQueueTopic: 
      process.env.SUBMISSION_RATING_QUEUE_TOPIC || 
      process.env.DEFAULT_SUBMISSION_RATING_QUEUE_TOPIC
    }
  },
  version: process.env.DEFAULT_VERSION,
  URLPrefix: process.env.DEFAULT_URL_PREFIX,
  webUrl: process.env.DEFAULT_WEB_URL
};

db_connect(configuration);

kafka_connect(configuration);

module.exports = configuration;
