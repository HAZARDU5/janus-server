var Database = require('../database/Database');
var database = new Database();
var sequelize = database.connect();
var Sequelize = require('sequelize');

//note: don't refer to other models from within the model - this causes issues with Sequelize
//eager loading relationships using `include` option from within model won't work - must be performed when selecting
//users using ORM

var User = sequelize.define('User', {

    //id: { type: Sequelize.INTEGER },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    email: {
        type: Sequelize.STRING,
        validate: { min: 0 }
    },
    ip: { type: Sequelize.STRING },
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

    //associations with other models are defined here. note the seperate model for the join table representing the
    //relationship. The foreignKey also needs to be defined or it will revert to using the `UserId` column for the
    //join table


    return User;
}
