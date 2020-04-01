const kafkaCommunicationsOnOff = (!process.env.KAFKA_COMMUNICATIONS_ON_OFF || process.env.KAFKA_COMMUNICATIONS_ON_OFF != "OFF") ? "ON" : "OFF"
const completedObservationSubmissionKafkaTopic = (process.env.COMPLETED_OBSERVATION_SUBMISSION_TOPIC && process.env.COMPLETED_OBSERVATION_SUBMISSION_TOPIC != "OFF") ? process.env.COMPLETED_OBSERVATION_SUBMISSION_TOPIC : "sl-observations-dev"
const completedSubmissionKafkaTopic = (process.env.COMPLETED_SUBMISSION_TOPIC && process.env.COMPLETED_SUBMISSION_TOPIC != "OFF") ? process.env.COMPLETED_SUBMISSION_TOPIC : "sl-submissions-dev"
const inCompleteObservationSubmissionKafkaTopic = (process.env.INCOMPLETE_OBSERVATION_SUBMISSION_TOPIC && process.env.INCOMPLETE_OBSERVATION_SUBMISSION_TOPIC != "OFF") ? process.env.INCOMPLETE_OBSERVATION_SUBMISSION_TOPIC : "sl-incomplete-observations-dev"
const inCompleteSubmissionKafkaTopic = (process.env.INCOMPLETE_SUBMISSION_TOPIC && process.env.INCOMPLETE_SUBMISSION_TOPIC != "OFF") ? process.env.INCOMPLETE_SUBMISSION_TOPIC : "sl-incomplete-submissions-dev"
const submissionRatingQueueKafkaTopic = (process.env.SUBMISSION_RATING_QUEUE_TOPIC && process.env.SUBMISSION_RATING_QUEUE_TOPIC != "OFF") ? process.env.SUBMISSION_RATING_QUEUE_TOPIC : "sl-submissions-rating-dev"
const notificationsKafkaTopic = (process.env.NOTIFICATIONS_TOPIC && process.env.NOTIFICATIONS_TOPIC != "OFF") ? process.env.NOTIFICATIONS_TOPIC : "sl-notifications-dev"

const pushCompletedObservationSubmissionToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: completedObservationSubmissionKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}


const pushCompletedSubmissionToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: completedSubmissionKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}

const pushInCompleteObservationSubmissionToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: inCompleteObservationSubmissionKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}


const pushInCompleteSubmissionToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: inCompleteSubmissionKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}

const pushSubmissionToKafkaQueueForRating = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: submissionRatingQueueKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}


const pushObservationSubmissionToKafkaQueueForRating = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: submissionRatingQueueKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}

const pushEntityAssessorNotificationToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
      try {

          let kafkaPushStatus = await pushMessageToKafka([{
            topic: notificationsKafkaTopic,
            messages: JSON.stringify(message)
          }])

          return resolve(kafkaPushStatus)

      } catch (error) {
          return reject(error);
      }
  })
}


const pushMessageToKafka = function(payload) {
  return new Promise((resolve, reject) => {

    if (kafkaCommunicationsOnOff != "ON") {
      throw reject("Kafka configuration is not done")
    }

    kafkaClient.kafkaProducer.send(payload, (err, data) => {
      if (err) {
        return reject("Kafka push to topic "+ payload[0].topic +" failed.")
      } else {
        return resolve(data)
      }
    })

  }).then(result => {

    if(result[payload[0].topic][0] >0) {
      return {
        status : "success",
        message: "Kafka push to topic "+ payload[0].topic +" successful with number - "+result[payload[0].topic][0]
      }
    }

  }).catch((err) => {
    return {
      status : "failed",
      message: err
    }
  })
}

module.exports = {
  pushCompletedSubmissionToKafka : pushCompletedSubmissionToKafka,
  pushCompletedObservationSubmissionToKafka : pushCompletedObservationSubmissionToKafka,
  pushEntityAssessorNotificationToKafka : pushEntityAssessorNotificationToKafka,
  pushSubmissionToKafkaQueueForRating : pushSubmissionToKafkaQueueForRating,
  pushObservationSubmissionToKafkaQueueForRating : pushObservationSubmissionToKafkaQueueForRating,
  pushInCompleteSubmissionToKafka : pushInCompleteSubmissionToKafka,
  pushInCompleteObservationSubmissionToKafka : pushInCompleteObservationSubmissionToKafka,
};

