(function() {
    "use strict";

    var csv = require('csv'),
        _ = require('underscore'),
        headValues = [],
        mapInsertSQL = [],
        csvDirectory = '/csv/',
        sequelize = require('../dbconfig').sequelize,
        associations = require('../routes/associations'),
        parseHeader = function(row) {
            _.each(row, function(item) {
                _.each(item.split(','), function(tableColName) {
                    tableColName = tableColName.replace(/^\s+/, '');
                    headValues.push(tableColName);
                });
            });
        },
        parseData = function(row) {
            var valueObj = [],
                valueString = "";
            _.each(row, function(item) {
                _.each(item.split(','), function(insertValues) {
                    insertValues = insertValues.replace(/^\s+/, '');
                    if (!isNaN(insertValues)) {
                        valueString = parseInt(insertValues, 10);
                    } else {
                        valueString = insertValues;
                    }
                    valueObj.push(valueString);
                });
            });
            return _.object(headValues, valueObj);
        },
        addResponseEntries = function() {
            var data = [{
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
            }];
            data.forEach(function(value) {
                associations.tbl_response
                    .create({
                        hasresponse: value.hasresponse
                    }).success(function(response) {
                        associations.tbl_users.find({
                            where: {
                                id: value.empid
                            }
                        }).success(function(user) {
                            response.addTblUser(user);
                        });

                        associations.tbl_greetings.find({
                            where: {
                                id: value.greetingid
                            }
                        }).success(function(greeting) {
                            response.addTblGreeting(greeting);
                        });
                    });
            });
        },
        addGreetingEntries = function() {
            var data = [{
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
            }, {
                empid: 10789,
                url: '/uploads/dkjvhkxjh.png'
            }, {
                empid: 7601,
                url: '/uploads/cvnvbn.jpg'
            }];
            data.forEach(function(value) {
                associations.tbl_greetings
                    .create({
                        url: value.url
                    }).success(function(greeting) {
                        associations.tbl_users.find({
                            where: {
                                id: value.empid
                            }
                        }).success(function(user) {
                            greeting.addTblUser(user);
                        });
                    });
            });
            addResponseEntries();
        },
        csvEngine = function(csvDirectory, tableName) {
            csv()
                .from.path(__dirname + csvDirectory + tableName + '.in', {
                    delimiter: ',',
                    escape: '"'
                })
                .on('record', function(row, index) {
                    /* Pre condition, the first row needs to be string */
                    if (index === 0) {
                        parseHeader(row);
                        return;
                    }
                    mapInsertSQL.push(parseData(row));
                })
                .on('end', function() {
                    sequelize.sync().on('success', function() {
                        associations.tbl_users
                            .bulkCreate(mapInsertSQL)
                            .on('success', function() {
                                addGreetingEntries();
                            });
                    }).on('error', function(error) {
                        console.log(error);
                    });
                })
                .on('error', function(error) {
                    console.log(error.message);
                });
        };

    csvEngine(csvDirectory, associations.tbl_users.options.tableName);

}());