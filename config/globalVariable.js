let fs = require("fs"),
  path = require("path");
const requireAll = require("require-all");
mkdirp(path.join(__dirname + "/../logs/" + process.env.NODE_ENV));
mkdirp(path.join(__dirname + "/../" + "uploads"));

gen = Object.assign(global, {});

module.exports = function () {
  var Log = require("log");
  // let createStream = fs.createWriteStream(
  //   __dirname +
  //     "/../logs/" +
  //     process.env.NODE_ENV +
  //     "/log-" +
  //     new Date().getTime() +
  //     ".log",
  //   { flags: "w" }
  // );
  // let readStream = fs.createReadStream(__dirname +'/../logs/'+process.env.NODE_ENV + '/logs.log');
  global.async = require("async");
  global.ROOT_PATH = path.join(__dirname, '..')
  global.GENERIC_HELPERS_PATH = ROOT_PATH + "/generics/helpers"
  global.MODULES_BASE_PATH = ROOT_PATH + "/module"
  global.log = new Log(global.config.log);
  global._ = require("lodash");
  gen.utils = require(ROOT_PATH + "/generics/helpers/utils");
  global.config = require(".");

  global.httpStatusCode = 
  require(ROOT_PATH + "/generics/httpStatusCodes");

  global.ENABLE_DEBUG_LOGGING = process.env.ENABLE_DEBUG_LOGGING || "ON";
  global.ENABLE_BUNYAN_LOGGING = process.env.ENABLE_BUNYAN_LOGGING || "ON";


  global.REQUEST_TIMEOUT_FOR_REPORTS = process.env.REQUEST_TIMEOUT_FOR_REPORTS || 120000;

  // boostrap all models
  global.models = requireAll({
    dirname: ROOT_PATH + "/models",
    filter: /(.+)\.js$/,
    resolve: function (Model) {
      return Model;
    }
  });

  //load base v1 controllers
  fs.readdirSync(ROOT_PATH + '/controllers/v1/').forEach(function (file) {
    checkWhetherFolderExistsOrNor(ROOT_PATH + '/controllers/v1/', file);
  });

  //load base v2 controllers
  fs.readdirSync(ROOT_PATH + '/controllers/v2/').forEach(function (file) {
    checkWhetherFolderExistsOrNor(ROOT_PATH + '/controllers/v2/', file);
  });

  function checkWhetherFolderExistsOrNor(pathToFolder, file) {

    let folderExists = fs.lstatSync(pathToFolder + file).isDirectory();

    if (folderExists) {
      fs.readdirSync(pathToFolder + file).forEach(function (folderOrFile) {
        checkWhetherFolderExistsOrNor(pathToFolder + file + "/", folderOrFile);
      })

    } else {
      if (file.match(/\.js$/) !== null) {
        require(pathToFolder + file);
      }
    }

  }

  //load schema files
  fs.readdirSync(ROOT_PATH + '/models/').forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      var name = file.replace('.js', '');
      global[name + 'Schema'] = require(ROOT_PATH + '/models/' + file);
    }
  });

  // boostrap all controllers
  global.controllers = requireAll({
    dirname: ROOT_PATH + "/controllers",
    filter: /(.+Controller)\.js$/,
    resolve: function (Controller) {
      if (Controller.name) return new Controller(models[Controller.name]);
      else return new Controller();
    }
  });

    // Load all message constants
    global.messageConstants = {};
    
    fs.readdirSync(ROOT_PATH + "/generics/messageConstants")
    .forEach(function (file) {
      if (file.match(/\.js$/) !== null) {
        let name = file.replace('.js', '');
        global.messageConstants[name] = 
        require(ROOT_PATH + "/generics/messageConstants/" + file);
      }
    });

  // Load all kafka consumer files
  fs.readdirSync(ROOT_PATH + '/generics/kafkaConsumers/').forEach(function (file) {
    if (file.match(/\.js$/) !== null) {
      var name = file.replace('Consumer.js', '');
      global[name + 'Consumer'] = require(ROOT_PATH + '/generics/kafkaConsumers/' + file);
    }
  });

  global.sessions = {};

  const libraryCategoriesHelper = require(MODULES_BASE_PATH+"/library/categories/helper");

  (async () => {
    await libraryCategoriesHelper.setLibraryCategories();
  })();

};

function mkdirp(dir, exist = "", state = 1) {
  if (dir != exist) {
    let path = dir.split("/");
    exist = exist + "/" + path[state];
    path = path.slice(state + 1, path.length);
    if (fs.existsSync(exist)) {
      mkdirp(dir, exist, ++state);
    } else {
      fs.mkdirSync(exist);
      mkdirp(dir, exist, ++state);
    }
  }
}
