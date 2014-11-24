var Auth = require('../../Auth');
var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];

var events = require('events');
var ERROR = require('../../events/ERROR');

/**
 * DatabaseSeeder
 *
 * Seeds the database with initial admin user accounts, groups etc
 *
 * @constructor
 */
function DatabaseSeeder() {

    var self = this;
}

DatabaseSeeder.prototype.run = function() {
    //database seeding

    //create admin user
    var auth = new Auth();

    auth.on(ERROR.UserExists,function(e){
        console.log(e.message);
        console.log('Did not insert admin user.');
    });
    auth.register('admin',envConfig.defaultAdminPass,'admin@janusvr.com');

};

var databaseSeeder = new DatabaseSeeder();

databaseSeeder.run();




