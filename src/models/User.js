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





//console.log(genericHelper);





sequelize.authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.');


        }
    });

var User = sequelize.define('User', {

    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    email: {
        type: Sequelize.STRING,
        validate: { min: 0 }
    },
    ip: { type: Sequelize.STRING },
    groupId: { type: Sequelize.INTEGER },
    enabled: { type: Sequelize.BOOLEAN }



},{
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: false,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: false,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: false,

    // define the table's name
    tableName: 'users',

    validate: {
        //custom validators go here
    }
});

module.exports = function(sequelize, DataTypes) {
    return User;
}
