var Auth = require('../Auth');
var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];

var events = require('events');
var ErrorEvent = require('../events/ErrorEvent');

global.log = require('../Logging');

var Database = require('../database/Database');
var database = new Database();
var sequelize = database.connect();

var User = sequelize.import("../../../src/models/User");
var Group = sequelize.import("../../../src/models/Group");
var GroupUser = sequelize.import("../../../src/models/GroupUser");
var Permission = sequelize.import("../../../src/models/Permission");
var GroupPermission = sequelize.import("../../../src/models/GroupPermission");

/**
 * DatabaseSeeder
 *
 * Seeds the database with initial admin user accounts, groups etc
 *
 * @constructor
 */
function AuthTest() {

}

AuthTest.prototype.run = function() {



    this.addUser();

    this.selectUser();

    this.removeUser();
};

AuthTest.prototype.selectUser = function() {
    console.log('\n'+'Selecting user...'+'\n');

    //must define the relationship before selecting
    User.hasMany(Group,{through:GroupUser});
    Group.hasMany(User,{through:GroupUser});

    User.findOne({username:'test', include: [Group]}).then(function(user){

        if(user == null){
            console.log('\n'+'User not found. '+'\n');
        }else{
            console.log('\n'+'User data: '+'\n');
            console.log(JSON.stringify(user)) ;

            if(typeof user.Groups != 'undefined'){
                console.log('\n'+'User groups: '+'\n');
                console.log(JSON.stringify(user.Groups)) ;
            }else{
                console.log('\n'+'User belongs to no groups: '+'\n');
            }
        }
    });
}

AuthTest.prototype.addUser = function() {
    console.log('\n'+'Adding user...'+'\n');

    var auth = new Auth();

    auth.addUser('test', 'test', 'michael@uxvirtual.com', ['user']);
}

AuthTest.prototype.removeUser = function() {
    console.log('\n'+'Removing user...'+'\n');

    var auth = new Auth();

    auth.removeUser('test');
}

var authTest = new AuthTest();

authTest.run();




