var Auth = require('../../Auth');

var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];

var Sequelize = require('sequelize');
var sequelize = new Sequelize(envConfig.database,
    envConfig.username,
    envConfig.password,
    {
        host: envConfig.host,
        dialect: envConfig.dialect,
        dialectOptions: envConfig.dialectOptions,
        port: envConfig.port
    })

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
    auth.register('admin',envConfig.defaultAdminPass,'admin@janusvr.com');
};

var databaseSeeder = new DatabaseSeeder();

databaseSeeder.run();




