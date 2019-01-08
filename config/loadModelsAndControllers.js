global.config = require(".");
require("./globalVariable")();
const requireAll = require("require-all");

// boostrap all models
global.models = requireAll({
    dirname: __dirname + "/../models",
    filter: /(.+)\.js$/,
    resolve: function (Model) {
        return Model;
    }
});

// boostrap all controllers
global.controllers = requireAll({
    dirname: __dirname + "/../controllers",
    filter: /(.+Controller)\.js$/,
    resolve: function (Controller) {
        if (Controller.name) return new Controller(models[Controller.name]);
        else return new Controller();
    }
});