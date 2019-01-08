'use strict'
require('../loaders')
const version = parseFloat(process.argv[2]);
if(!version) throw "Please provide version";
module.exports.up = function (next) {

    console.log("version : ", version);

    let migrationStatusData = {
        version: version,
        startTime: new Date
    }

    //your code goes here...


    //------call this after script excecuted
    gen.utils.createMigrationStatus(migrationStatusData).then(() => {
        console.log('migration status created')
        next();
    }).catch(err => {
        console.log(err)
    })
    //-----

}

module.exports.down = function (next) {
    next()
}
