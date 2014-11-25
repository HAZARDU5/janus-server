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
var Permission = sequelize.import("../../../src/models/Permission");
var GroupPermission = sequelize.import("../../../src/models/GroupPermission");

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
            {name:'admin',description:'Admins',enabled:1},
            {name:'user',description:'Users',enabled:1}
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
        auth.register('admin',envConfig.defaultAdminPass,'admin@janusvr.com',['admin']);
    })
    .then(function(){
        sequelize.query("TRUNCATE TABLE `"+Permission.tableName+"`").then(function(){
            sequelize.query("TRUNCATE TABLE `"+GroupPermission.tableName+"`").then(function(){
                log.info('Deleted all permissions.');

                log.info('Creating permissions...');

                Permission.bulkCreate([
                    {name:'allow_user_ban',description:'Allow banning of users in groups lower than yours.'},
                    {name:'allow_user_edit',description:'Allow editing of users in groups lower than yours.'},
                    {name:'allow_reset_room',description:'Allow resetting of rooms.'}
                ],{validate:true}).then(function(){
                        log.info('Created permissions.');

                        //create admin user
                        var auth = new Auth();

                        auth.addPermissions('admin',['allow_user_ban','allow_user_edit','allow_reset_room']);
                    });
            });
        });
    })
};

var databaseSeeder = new DatabaseSeeder();

databaseSeeder.run();




