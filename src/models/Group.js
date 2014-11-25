var Database = require('../database/Database');
var database = new Database();
var sequelize = database.connect();
var Sequelize = require('sequelize');

//note: don't refer to other models from within the model - this causes issues with Sequelize

var Group = sequelize.define('Group', {

    name: { type: Sequelize.STRING },
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
    tableName: 'groups',

    validate: {
        //custom validators go here
    }
});

module.exports = function(sequelize, DataTypes) {
    return Group;
}
