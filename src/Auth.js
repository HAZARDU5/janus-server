var bcrypt = require('bcrypt');
var Database = require('./database/Database');
var database = new Database();
var sequelize = database.connect();
var Sequelize = require('sequelize');

var events = require('events');
var ErrorEvent = require('./events/ErrorEvent');
var AuthEvent = require('./events/AuthEvent');

var User = sequelize.import(__dirname+"/models/User");
var Group = sequelize.import(__dirname+"/models/Group");
var Permission = sequelize.import(__dirname+"/models/Permission");
var GroupPermission = sequelize.import(__dirname+"/models/GroupPermission");
var GroupUser = sequelize.import(__dirname+"/models/GroupUser");



//sequelize.sync();

function Auth() {

    events.EventEmitter.call(this);
}

module.exports = Auth;

//allow the class to emit events
Auth.prototype.__proto__ = events.EventEmitter.prototype;

Auth.prototype.addUser = function(username,password,email,groups) {
    //encrypt password synchronously

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var self = this;

    User.find({ where: {username: username} }).then(function(user){
        //var errorEvent = new ErrorEvent();
        //var authEvent = new AuthEvent();
        //user already exist - throw error event
        if(user){
            self.emit(ErrorEvent.userExists,ErrorEvent.userExists);
        }else{
            User.create({username: username, password: hash, email: email, enabled: 1}).then(function(user){
                log.info('Created user: '+user.username);

                var groupAddedCount = 0;
                for(var i = 0; i < groups.length; i++){
                    Group.find({name: groups[i]}).then(function(group){
                        self.once(AuthEvent.userAddedGroup,function(e){
                            if(groupAddedCount == groups.length-1){
                                //successfully created the user and added it to specified groups
                                self.emit(AuthEvent.userAdded,AuthEvent.userAdded);
                            }
                        });
                        self.addToGroup(user,group);
                    });
                }
            });
        }

    });


}

//TODO: remove user from groups before removing user record
Auth.prototype.removeUser = function(username) {
    var self = this;



    User.find({ where: {username: username} }).then(function(user){
        //var errorEvent = new ErrorEvent();
        //var authEvent = new AuthEvent();
        //user does not exist - throw error event

        console.log(user);

        if(user == null){
            self.emit(ErrorEvent.userNotExists,ErrorEvent.userNotExists);
        }else{

            self.once(AuthEvent.userRemovedAllGroups,function(e){

                log.info(e.message);

                user.destroy().then(function(user){
                    log.info('Deleted user: '+user.username);

                    self.emit(AuthEvent.userRemoved,AuthEvent.userRemoved);
                });
            });

            self.removeFromAllGroups(user);


        }
    });
}

Auth.prototype.login = function() {

}

Auth.prototype.logout = function() {

}

Auth.prototype.resetPassword = function() {

}



Auth.prototype.removeFromAllGroups = function(user){
    User.hasMany(Group,{foreignKey: 'userId', through:GroupUser});
    Group.hasMany(User,{foreignKey: 'groupId', through:GroupUser});

    var self = this;

    user.setGroups([]).then(function(){
        self.emit(AuthEvent.userRemovedAllGroups,AuthEvent.userRemovedAllGroups);
    });


}

Auth.prototype.addToGroup = function(user,group) {
    //define relationships of users to groups. Make sure to include the join model
    //these relationships must be placed outside of the model
    User.hasMany(Group,{foreignKey: 'userId', through:GroupUser});
    Group.hasMany(User,{foreignKey: 'groupId', through:GroupUser});

    var self = this;
    //var authEvent = new AuthEvent();

    //since the relationship of users to groups is defined above, we can now access the `addGroup()` method of the user
    //model
    user.addGroup(group).then(function(){
     log.info('User added to group: '+group.description);
        self.emit(AuthEvent.userAddedGroup,AuthEvent.userAddedGroup);
     });
}

Auth.prototype.addPermissions = function(groupName,permissionsNames) {


    //define relationships of users to groups. Make sure to include the join model
    //these relationships must be placed outside of the model
    Group.hasMany(Permission,{foreignKey:'groupId',through:GroupPermission});
    Permission.hasMany(Group,{foreignKey:'permissionId',through:GroupPermission});

    var self = this;
    //var authEvent = new AuthEvent();

    Group.find({name:groupName}).then(function(group){

        //console.log('Found group: '+group)

        Permission.findAll({
            where: Sequelize.or({name:permissionsNames})
        }).then(function(permissions){

            group.addPermissions(permissions).then(function(){
                self.emit(AuthEvent.groupAddedPermissions,AuthEvent.groupAddedPermissions);
            });

            /*for(var i = 0; i < permissions.length; i++){
                // since the relationship of permissions to groups is defined above, we can now access the `addPermissions()`
                // method of the permissions model
                group.addPermissions(permissions[i]);
            }*/


        });
    });
}
