(function() {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_greetings = sequelize.import(__dirname + '\\..\\models\\create\\tbl_greetings'),
        tbl_users = sequelize.import(__dirname + '\\..\\models\\create\\tbl_users'),
        tbl_response = sequelize.import(__dirname + '\\..\\models\\create\\tbl_response'),
        tbl_greetingstbl_users = sequelize.import(__dirname + '\\..\\models\\create\\tbl_greetingstbl_users');

    /* User-greeting */
    tbl_users.hasMany(tbl_greetings, {
        foreignKey: 'empid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    tbl_greetings.hasMany(tbl_users, {
        foreignKey: 'greetingid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });

    /* Response-Greeting */
    tbl_greetings.hasMany(tbl_response, {
        foreignKey: 'greetingid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });

    tbl_response.hasMany(tbl_greetings, {
        foreignKey: 'responseid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });

    /* Response-User */
    tbl_users.hasMany(tbl_response, {
        foreignKey: 'empid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });

    tbl_response.hasMany(tbl_users, {
        foreignKey: 'responseid',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    /* Export the models */
    exports.tbl_greetings = tbl_greetings;
    exports.tbl_users = tbl_users;
    exports.tbl_response = tbl_response;
    exports.tbl_greetingstbl_users = tbl_greetingstbl_users;
}());