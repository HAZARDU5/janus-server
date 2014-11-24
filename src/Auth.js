//var sequelizeCLIHelpers = new SequelizeCLIHelpers(exports);
var bcrypt = require('bcrypt');
var Database = require('./database/Database');
var database = new Database();
var sequelize = database.connect();

var events = require('events');
var ErrorEvent = require('./events/ErrorEvent');

//console.log(sequelizeHelpers.config);

//var config = sequelizeHelpers.config.readConfig();

var User = sequelize.import(__dirname+"/models/User");

function Auth() {


    events.EventEmitter.call(this);
}

module.exports = Auth;

//allow the class to emit events
Auth.prototype.__proto__ = events.EventEmitter.prototype;

Auth.prototype.register = function(username,password,email) {
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
            User.create({username: username, password: hash, email: email, enabled: 1});
        }

    });


};

Auth.prototype.login = function() {

};

Auth.prototype.logout = function() {

};

Auth.prototype.resetPassword = function() {

};
