var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];
var Sequelize = require('sequelize');


function Database() {

}

module.exports = Database;


Database.prototype.connect = function() {
    return new Sequelize(envConfig.database,
        envConfig.username,
        envConfig.password,
        {
            host: envConfig.host,
            dialect: envConfig.dialect,
            dialectOptions: envConfig.dialectOptions,
            port: envConfig.port
        })
}