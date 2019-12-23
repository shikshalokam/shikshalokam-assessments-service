require("dotenv").config();
//config and routes
global.config = require("./config");
require("./config/globalVariable")();

let router = require("./routes");

//express
const express = require("express");
let app = express();

//required modules
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");
var path = require("path");
var expressValidator = require('express-validator');

//To enable cors
app.use(cors());
app.use(expressValidator())


//health check
app.get(process.env.HEALTH_CHECK_URL, (req, res) => {
  res.send(process.env.HEALTH_CHECK_RESPONSE);
});

app.use(fileUpload());
app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMIT }));
app.use(bodyParser.urlencoded({ limit: process.env.BODY_PARSER_LIMIT, extended: false }));
app.use(express.static(process.env.PUBLIC_FOLDER_PATH));

fs.existsSync(process.env.LOGGER_DIRECTORY) || fs.mkdirSync(process.env.LOGGER_DIRECTORY);

const serviceBaseUrl = 
process.env.APPLICATION_BASE_URL || 
process.env.DEFAULT_APPLICATION_BASE_URL;

const observationSubmissionsHtmlPath = 
process.env.OBSERVATION_SUBMISSIONS_HTML_PATH ? 
process.env.OBSERVATION_SUBMISSIONS_HTML_PATH : 
process.env.DEFAULT_OBSERVATION_SUBMISSIONS_HTML_PATH;

app.use(express.static(observationSubmissionsHtmlPath));
app.get(serviceBaseUrl+observationSubmissionsHtmlPath+"/*", (req, res) => {
      let urlArray = req.path.split("/")
      urlArray.splice(0,3)
      res.sendFile(path.join(__dirname, "/public/"+observationSubmissionsHtmlPath+"/"+urlArray.join("/")));
});

//API documentation (apidoc)
if (
  process.env.NODE_ENV == process.env.DEFAULT_NODE_ENV || 
  process.env.NODE_ENV == process.env.DEFAULT_LOCAL_NODE_ENV
) {
  app.use(express.static(process.env.DEFAULT_APIDOC_URL));
  if(process.env.NODE_ENV == process.env.DEFAULT_LOCAL_NODE_ENV) {
    app.get("/"+process.env.DEFAULT_APIDOC_URL, (req, res) => {
      res.sendFile(path.join(__dirname, "/public/apidoc/index.html"));
    });
  } else {
    app.get(serviceBaseUrl+process.env.DEFAULT_APIDOC_URL+"/*", (req, res) => {
      let urlArray = req.path.split("/")
      urlArray.splice(0,3)
      res.sendFile(path.join(__dirname, "/public/apidoc/"+urlArray.join("/")));
    });
  }
}

app.get(serviceBaseUrl + "web2/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public" + serviceBaseUrl + "web2/index.html"));
});

var bunyan = require("bunyan");
global.loggerObj = bunyan.createLogger({
  name: "foo",
  streams: [
    {
      type: "rotating-file",
      path: path.join(__dirname + "/logs/" + process.pid + "-all.log"),
      period: "1d", // daily rotation
      count: 3 // keep 3 back copies
    }
  ]
});
global.loggerExceptionObj = bunyan.createLogger({
  name: "exceptionLogs",
  streams: [
    {
      type: "rotating-file",
      path: path.join(__dirname + "/logs/" + process.pid + "-exception.log"),
      period: "1d", // daily rotation
      count: 3 // keep 3 back copies
    }
  ]
});

app.all(process.env.ALL_ROUTES, (req, res, next) => {
  if(ENABLE_BUNYAN_LOGGING === "ON") {
    loggerObj.info({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });
  }

  if(ENABLE_CONSOLE_LOGGING === "ON") {
    log.info("-------Request log starts here------------------");
    log.info(
      "%s %s on %s from ",
      req.method,
      req.url,
      new Date(),
      req.headers["user-agent"]
    );
    log.info("Request Headers: ", req.headers);
    log.info("Request Body: ", req.body);
    log.info("Request Files: ", req.files);
    log.info("-------Request log ends here------------------");
  }
  next();
});


//add routing
router(app);

//listen to given port
app.listen(config.port, () => {

  log.info(
    "Environment: " +
    (process.env.NODE_ENV ? process.env.NODE_ENV : process.env.DEFAULT_NODE_ENV)
  );

  log.info("Application is running on the port:" + config.port);

});
