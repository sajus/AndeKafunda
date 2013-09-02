(function() {
    "use strict";

    var csv = require('csv')
        , _ = require('underscore')
        , SQLValue = ""
        , headValues = []
        , insertSQL = {}
        , mapInsertSQL  = [];

    /**
      * Specify the path for of CSV directory
    ***/
    var csvDirectory = '/csv/';

    /**
      * Sequelize Model layer
    ***/
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

    var parseHeader = function(row) {
        _.each(row, function(item){
            _.each(item.split(','), function(tableColName){
                tableColName = tableColName.replace(/^\s+/, '');
                headValues.push(tableColName);
            });
        });
    }

    var parseData = function(row) {
        var valueObj = [];
        var valueString = "";
        _.each(row, function(item){
            _.each(item.split(','), function(insertValues) {
                insertValues = insertValues.replace(/^\s+/, '');
                if(!isNaN(insertValues)){
                    valueString = parseInt(insertValues);
                } else {
                    valueString = insertValues;
                }
                valueObj.push(valueString);
            });
        });
        return insertSQL = _.object(headValues, valueObj);
    }

    var addResponseEntries = function() {
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
                console.log("Response table is ready");
                console.log("Database Tables has been setup successfully");
            }).on('error', function(error) {
                console.log("Error occured while creating response table!");
                console.log(error);
            });
    }

    var addGreetingEntries = function() {
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
                console.log("Greeting table is ready");
                addResponseEntries();
            }).on('error', function(error) {
                console.log("Error occured while creating greeting table!");
                console.log(error);
            });
    }

    var csvEngine = function(csvDirectory, tableName) {
        console.log("Executing database rollout script...");
        csv()
            .from.path(__dirname + csvDirectory + tableName + '.in', { delimiter: ',', escape: '"' })
            .on('record', function(row, index){
                /* Pre condition, the first row needs to be string */
                if(index == 0){
                    parseHeader(row);
                    return;
                }
                mapInsertSQL.push(parseData(row));
            })
            .on('end', function(){
                sequelize.sync().on('success', function() {
                    tbl_users
                        .bulkCreate(mapInsertSQL)
                        .on('success', function() {
                            console.log("Users table is ready");
                            addGreetingEntries();
                        });
                }).on('error', function(error) {
                    console.log("Error occured while creating users table!");
                    console.log(error);
                });
            })
            .on('error', function(error){
                console.log(error.message);
            });
    }

    csvEngine(csvDirectory, tbl_users.options.tableName);

}());
