(function() {
    "use strict";

    var csv = require('csv'),
        _ = require('underscore'),
        headValues = [],
        mapInsertSQL = [],
        csvDirectory = '/csv/',
        sequelize = require('../dbconfig').sequelize,
        Sequelize = require('sequelize'),
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
                greetingid: 1
            }, {
                empid: 10789,
                greetingid: 2
            }, {
                empid: 10368,
                greetingid: 3
            }, {
                empid: 10748,
                greetingid: 1
            }];
            data.forEach(function(value) {
                associations.tbl_response
                    .create({
                        hasresponse: true
                    }).success(function(response) {
                        associations.tbl_users.find({
                            where: {
                                id: value.empid
                            }
                        }).success(function(user) {
                            response.addTblUser(user).on('success', function() {
                                associations.tbl_greetings.find({
                                    where: {
                                        id: value.greetingid
                                    }
                                }).success(function(greeting) {
                                    response.addTblGreeting(greeting).on('success',function(){
                                        console.log("reponse entries are added successfully");
                                    });
                                });
                            });
                        });
                    });
            });
        },
        addGreetingEntries = function() {
            var data = [{
                empid: 7601,
                url: '/banner.png'
            }, {
                empid: 10789,
                url: '/bike.png'
            }, {
                empid: 10748,
                url: '/freeshipping-lower48.jpg'
            }, {
                empid: 10368,
                url: '/cull-Panda.jpg'
            }, {
                empid: 10789,
                url: '/estore-left-banner-hm5now.jpg'
            }, {
                empid: 7601,
                url: '/bike1.png'
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