(function(exports) {
    'use strict';
    var associations = require('./associations'),
        _ = require('underscore'),
        Promise = require("node-promise").Promise;

    function errorHandler(error, res) {
        console.error(error.message);
        res.format({
            json: function() {
                res.send(error.message);
            }
        });
    }

    exports.createGreeting = function(req, res) {
        var requestBody = req.body;
        associations.tbl_greetings.create({
            url: requestBody.url
        }).on("success", function(greeting) {
            associations.tbl_users.find({
                where: {
                    id: requestBody.empid
                }
            }).success(function(user) {
                greeting.addTblUser(user).on("success", function() {
                    res.format({
                        json: function() {
                            res.send({
                                greetingid: greeting.id
                            });
                        }
                    });
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getGreetingsList = function(req, res) {
        associations.tbl_greetings.findAll({
            include: [associations.tbl_users],
            where: '`tbl_greetings`.`deletedAt` IS NULL AND `tbl_greetingstbl_users`.`deletedAt` IS NULL'
        }).on("success", function(greeting) {
            res.format({
                json: function() {
                    res.send(greeting);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getGreetingsById = function(req, res) {
        associations.tbl_greetings.find({
            include: [associations.tbl_users],
            where: '`tbl_greetingstbl_users`.`deletedAt` IS NULL AND `tbl_greetingstbl_users`.`greetingid`= ' + parseInt(req.params.id, 10)
        }).on("success", function(greeting) {
            res.format({
                json: function() {
                    res.send(greeting);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.putGreetingsById = function(req, res) {
        var requestBody = req.body;
        associations.tbl_greetings.update({
            url: requestBody.url
        }, {
            id: parseInt(req.params.id, 10)
        }).on('success', function() {
            associations.tbl_greetings.find({
                include: [associations.tbl_users],
                where: '`tbl_greetingstbl_users`.`greetingid`= ' + parseInt(req.params.id, 10) + ' AND `tbl_greetingstbl_users`.`deletedAt` IS NULL'
            }).on('success', function(greeting) {

                if (greeting.tblUsers[0].get('id') === parseInt(requestBody.empid, 10)) {
                    res.format({
                        json: function() {
                            res.send(req.params.id);
                        }
                    });
                } else {
                    greeting.removeTblUser(greeting.tblUsers[0]).on('success', function() {
                        associations.tbl_users.find({
                            where: {
                                id: parseInt(requestBody.empid, 10)
                            }
                        }).on('success', function(newArtist) {
                            greeting.addTblUser(newArtist).on('success', function() {
                                res.format({
                                    json: function() {
                                        res.send(req.params.id);
                                    }
                                });
                            });
                        });
                    });
                }

            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.delGreetingsById = function(req, res) {
        // Remove the responses for this greeting
        // Remove the designer mapping 
        var delIds = req.params.id.split(','),
            greetingCounter = 0;
        delIds = _.map(delIds, function(val) {
            return parseInt(val, 10);
        });
        associations.tbl_greetings.findAll({
            where: {
                id: delIds
            }
        }).on('success', function(greetings) {
            _.each(greetings, function(greeting) {
                greetingCounter++;
                deleteGreetingReferences(greeting).then(function() {
                    deleteResponseReferences(greeting).then(function() {
                        greeting.destroy().on('success', function() {
                            --greetingCounter;
                            if (greetingCounter === 0) {
                                res.format({
                                    json: function() {
                                        res.send(delIds);
                                    }
                                });
                            }
                        });
                    });
                });
            });
        });
    };

    function deleteGreetingReferences(greeting) {
        var promise = new Promise();
        greeting.getTblUsers().on('success', function(users) {
            if (users.length === 0) {
                promise.resolve('greeting references for greeting deleted successfully');
            } else {
                _.each(users, function(user) {
                    greeting.removeTblUser(user).on('success', function() {
                        promise.resolve('greeting references for greeting deleted successfully');
                    });
                });
            }
        });
        return promise;
    }

    function deleteResponseReferences(greeting) {
        var responseCounter = 0,
            promise = new Promise();
        greeting.getTblResponses().on('success', function(responses) {
            if (responses.length === 0) {
                promise.resolve("Response references for the greeting deleted successfully");
            } else {
                _.each(responses, function(response) {
                    ++responseCounter;
                    greeting.removeTblResponse(response).on('success', function() {
                        associations.tbl_responsetbl_users.destroy({
                            responseid: response.id
                        }).on('success', function() {
                            response.destroy().on('success', function() {
                                console.log("response itself is deleted");
                                --responseCounter;
                                if (responseCounter === 0) {
                                    promise.resolve("Response references for the greeting deleted successfully");
                                }
                            });
                        });
                    });
                });
            }
        });
        return promise;
    }
}(exports));