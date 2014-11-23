var sets = require('simplesets');

function User(name) {

    this._name = name;
    this._portals = new sets.Set();

    log.info('Created user with ID: '+name);

}

module.exports = User;

User.prototype.delete = function(userid) {

};
