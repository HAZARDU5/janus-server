var bcrypt = require('bcrypt');
var Database = require('./database/Database');
var database = new Database();
var sequelize = database.connect();

var events = require('events');
var ErrorEvent = require('./events/ErrorEvent');

var User = sequelize.import(__dirname+"/models/User");
var Group = sequelize.import(__dirname+"/models/Group");
var GroupUsers = sequelize.import(__dirname+"/models/GroupUsers");



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
                    Group.find({id: groups[i]}).then(function(group){
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
    User.hasMany(Group,{through:GroupUsers});
    Group.hasMany(User,{through:GroupUsers});

    //since the relationship of users to groups is defined above, we can now access the `addGroup()` method of the user
    //model
    user.addGroup(group).then(function(){
     log.info('User added to group: '+group.id);
     });
}
