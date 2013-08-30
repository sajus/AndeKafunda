(function() {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_users = sequelize.import(__dirname + '/create/tbl_users'),
        tbl_greetings = sequelize.import(__dirname + '/create/tbl_greetings'),
        tbl_response = sequelize.import(__dirname + '/create/tbl_response');

    tbl_users.hasMany(tbl_response, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    tbl_greetings.hasMany(tbl_response, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    tbl_users.hasMany(tbl_greetings, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });

    sequelize.sync().on('success', function() {
        tbl_users
            .bulkCreate([{
                empid: 7601,
                email: 'sajus@cybage.com',
                firstname: 'Saju',
                lastname: 'Sasidharan',
                password: 'sajus',
                accesstype: 1
            }, {
                empid: 10789,
                email: 'vinayakpat@cybage.com',
                firstname: 'Vinayak',
                lastname: 'Patil',
                password: 'vinayakpat',
                accesstype: 0
            }])
            .on('success', function() {
                console.log("Users Table Created");
            });
    });

    sequelize.sync().on('success', function() {
        tbl_greetings
            .create({
                empid: 7601,
                url: '/uploads/google.png'
            })
            .on('success', function() {
                console.log("Greeting Table Created");
            });
    });

    sequelize.sync().on('success', function() {
        tbl_response
            .create({
                empid: 7601,
                greetingid: 1,
                hasresponse: true
            })
            .on('success', function() {
                console.log("Response Table Created");
            });
    });
}());