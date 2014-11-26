var Auth = require('../Auth');
var config = require('sequelize-cli/bin/config/config.json');
var genericHelper = require('sequelize-cli/lib/helpers/generic-helper');
var envConfig = config[genericHelper.getEnvironment()];

var events = require('events');
var TestEvent = require('./events/TestEvent');
var AuthEvent = require('../events/AuthEvent');

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
    events.EventEmitter.call(this);
}

//allow the class to emit events
AuthTest.prototype.__proto__ = events.EventEmitter.prototype;

AuthTest.prototype.run = function() {

    var self = this;

    self.once(TestEvent.userAdded,function(e){
        console.log(e.message);

        self.once(TestEvent.userSelected,function(e){
            console.log(e.message);

            self.once(TestEvent.userRemoved,function(e){
                console.log(e.message);
            });

            self.removeUser();

        });

        self.selectUser();

    });





    this.addUser();

};

AuthTest.prototype.selectUser = function() {
    console.log('\n'+'Selecting user...'+'\n');

    //must define the relationship before selecting
    User.hasMany(Group,{through:GroupUser});
    Group.hasMany(User,{through:GroupUser});

    var self = this;

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

            self.emit(TestEvent.userSelected,TestEvent.userSelected);
        }
    });
}

AuthTest.prototype.addUser = function() {
    console.log('\n'+'Adding user...'+'\n');

    var auth = new Auth();
    var self = this;

    auth.once(AuthEvent.userAdded,function(e){
        console.log(e);
        self.emit(TestEvent.userAdded,TestEvent.userAdded);
    });

    auth.addUser('test', 'test', 'michael@uxvirtual.com', ['user']);
}

AuthTest.prototype.removeUser = function() {
    console.log('\n'+'Removing user...'+'\n');

    var auth = new Auth();
    var self = this;

    auth.once(AuthEvent.userRemoved,function(e){
        console.log(e);
        self.emit(TestEvent.userRemoved,TestEvent.userRemoved);
    });

    auth.removeUser('test');
}

var authTest = new AuthTest();

authTest.run();




