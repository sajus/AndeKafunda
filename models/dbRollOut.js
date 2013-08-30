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

    function addResponseEntries() {
        tbl_response
            .bulkCreate([{
                empid: 7601,
                greetingid: 1,
                hasresponse: true
            }, {
                empid: 7601,
                greetingid: 2,
                hasresponse: true
            }, {
                empid: 7601,
                greetingid: 3,
                hasresponse: true
            }, {
                empid: 10789,
                greetingid: 1,
                hasresponse: true
            }, {
                empid: 10748,
                greetingid: 2,
                hasresponse: true
            }, {
                empid: 10368,
                greetingid: 1,
                hasresponse: true
            }])
            .on('success', function() {
                console.log("Response Table Created");
                console.log("Database has been setup successfully");
            });
    }

    function addGreetingEntries() {
        tbl_greetings
            .bulkCreate([{
                empid: 7601,
                url: '/uploads/google.png'
            }, {
                empid: 10789,
                url: '/uploads/chcha.png'
            }, {
                empid: 10748,
                url: '/uploads/budhao.png'
            }, {
                empid: 10368,
                url: '/uploads/jj.png'
            }])
            .on('success', function() {
                console.log("Greeting Table Created");
                console.log("Adding Response entries");
                addResponseEntries();
            });
    }
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
            }, {
                empid: 10748,
                email: 'ashwinh@cybage.com',
                firstname: 'Ashwin',
                lastname: 'Hegde',
                password: 'ashwinh',
                accesstype: 0
            }, {
                empid: 10368,
                email: 'jerinj@cybage.com',
                firstname: 'Jerin',
                lastname: 'John',
                password: 'jerinj',
                accesstype: 0
            }])
            .on('success', function() {
                console.log("Users Table Created");
                console.log("Adding greetings entries");
                addGreetingEntries();
            });
    });
}());