var bcrypt = require('bcrypt');
var Database = require('./database/Database');
var database = new Database();
var sequelize = database.connect();
var Sequelize = require('sequelize');

var events = require('events');
var ErrorEvent = require('./events/ErrorEvent');

var User = sequelize.import(__dirname+"/models/User");
var Group = sequelize.import(__dirname+"/models/Group");
var Permission = sequelize.import(__dirname+"/models/Permission");
var GroupPermission = sequelize.import(__dirname+"/models/GroupPermission");
var GroupUser = sequelize.import(__dirname+"/models/GroupUser");



sequelize.sync();

function Auth() {

    events.EventEmitter.call(this);
}

module.exports = Auth;

//allow the class to emit events
Auth.prototype.__proto__ = events.EventEmitter.prototype;

Auth.prototype.register = function(username,password,email,groups) {
    //encrypt password synchronously

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var self = this;

    User.find({ where: {username: username} }).then(function(user){
        var errorEvent = new ErrorEvent();
        //user already exist - throw error event
        if(user){
            self.emit(ErrorEvent.userExists,errorEvent.userExists);
        }else{
            User.create({username: username, password: hash, email: email, enabled: 1}).then(function(user){
                log.info('Created user: '+user.username);

                for(var i = 0; i < groups.length; i++){
                    Group.find({name: groups[i]}).then(function(group){
                        self.addToGroup(user,group);
                    });
                }
            });
        }

    });


}

Auth.prototype.login = function() {

}

Auth.prototype.logout = function() {

}

Auth.prototype.resetPassword = function() {

}

Auth.prototype.addToGroup = function(user,group) {
    //define relationships of users to groups. Make sure to include the join model
    //these relationships must be placed outside of the model
    User.hasMany(Group,{through:GroupUser});
    Group.hasMany(User,{through:GroupUser});

    //since the relationship of users to groups is defined above, we can now access the `addGroup()` method of the user
    //model
    user.addGroup(group).then(function(){
     log.info('User added to group: '+group.description);
     });
}

Auth.prototype.addPermissions = function(groupName,permissionsNames) {


    //define relationships of users to groups. Make sure to include the join model
    //these relationships must be placed outside of the model
    Group.hasMany(Permission,{through:GroupPermission});
    Permission.hasMany(Group,{through:GroupPermission});

    Group.find({name:groupName}).then(function(group){

        //console.log('Found group: '+group)

        Permission.findAll({
            where: Sequelize.or({name:permissionsNames})
        }).then(function(permissions){

            for(var i = 0; i < permissions.length; i++){
                // since the relationship of permissions to groups is defined above, we can now access the `addPermissions()`
                // method of the permissions model
                group.addPermissions(permissions[i]);
            }


        });
    });
}
