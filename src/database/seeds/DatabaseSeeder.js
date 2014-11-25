var Auth = require('../../Auth');
var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];

var events = require('events');
var ErrorEvent = require('../../events/ErrorEvent');

global.log = require('../../Logging');

var Database = require('../Database');
var database = new Database();
var sequelize = database.connect();
var Group = sequelize.import("../../../src/models/Group");

/**
 * DatabaseSeeder
 *
 * Seeds the database with initial admin user accounts, groups etc
 *
 * @constructor
 */
function DatabaseSeeder() {

}

DatabaseSeeder.prototype.run = function() {
    //database seeding

    //deleting groups

    log.info('Deleting all groups...');

    /*Group.findAll().then(function(groups){

        for(var i = 0; i < groups.length; i++){
            groups[i].destroy({force:true}).then(function(){
                log.info('Deleted group.');
            });
        }
    })*/
    sequelize.query("TRUNCATE TABLE `"+Group.tableName+"`")
    .then(function(){
        log.info('Deleted all groups.');
    })
    .then(function(){
        //create groups
        log.info('Creating groups...');
        Group.bulkCreate([
            {name:'Admins',enabled:1},
            {name:'Users',enabled:1}
        ],{validate:true}).then(function(){
                log.info('Created groups.');
            });
    })
    .then(function(){
        //create admin user
        var auth = new Auth();

        log.info('Creating users...');

        auth.on(ErrorEvent.userExists,function(e){
            log.info(e.message);
            log.info('Did not insert admin user.');
        });
        auth.register('admin',envConfig.defaultAdminPass,'admin@janusvr.com',[1]);
    });







};

var databaseSeeder = new DatabaseSeeder();

databaseSeeder.run();




