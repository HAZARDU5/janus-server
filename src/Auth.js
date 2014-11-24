//var sequelizeCLIHelpers = new SequelizeCLIHelpers(exports);

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

var bcrypt = require('bcrypt');

//console.log(sequelizeHelpers.config);

//var config = sequelizeHelpers.config.readConfig();

var User = sequelize.import(__dirname+"/models/User");

function Auth() {

    var self = this;
}

module.exports = Auth;

Auth.prototype.register = function(username,password,email) {
    //encrypt password synchronously

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);





    User.create({username: username, password: hash, email: email});

    //


    //User.findOrCreate({ where: {username: {eq: username}}, defaults: { password: hash, email: email } });
    /*.spread(function(user, wasCreated) {
            log.info(user.values);
            log.info(wasCreated);



            //return PromiseChain
        });*/
};

Auth.prototype.login = function() {

};

Auth.prototype.logout = function() {

};

Auth.prototype.resetPassword = function() {

};
