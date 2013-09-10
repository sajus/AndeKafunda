(function(exports) {
    'use strict';
    var associations = require('./associations'),
        _ = require('underscore');

    function errorHandler(error, res) {
        console.error(error.message);
        res.format({
            json: function() {
                res.send(error.message);
            }
        });
    }

    exports.createResponse = function(req, res) {
        var requestBody = req.body;
        associations.tbl_response
            .create({
                hasresponse: true
            }).on('success', function(response) {
                associations.tbl_users.find({
                    where: {
                        id: requestBody.empid
                    }
                }).success(function(user) {
                    response.addTblUser(user);
                });

                associations.tbl_greetings.find({
                    where: {
                        id: requestBody.greetingid
                    }
                }).success(function(greetings) {
                    _.each(greetings, function(greeting) {
                        response.addTblGreeting(greeting);
                    });
                    res.format({
                        json: function() {
                            res.send({
                                responseid: response.id
                            });
                        }
                    });
                });
            }).on('error', function(error) {
                errorHandler(error, res);
            });
    };

    exports.getResponsesList = function(req, res) {
        associations.tbl_response.findAll({
            include: [associations.tbl_users, associations.tbl_greetings],
            where: '`tbl_response`.`deletedAt` IS NULL AND `tbl_responsetbl_users`.`deletedAt` IS NULL AND `tbl_greetingstbl_response`.`deletedAt` IS NULL'
        }).on("success", function(response) {
            res.format({
                json: function() {
                    res.send(response);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponsesByEmpId = function(req, res) {
        associations.tbl_response.findAll({
            include: [associations.tbl_users, associations.tbl_greetings],
            where: '`tbl_responsetbl_users`.`deletedAt` IS NULL AND `tbl_responsetbl_users`.`empid`= ' + parseInt(req.params.empid, 10)
        }).on("success", function(response) {
            res.format({
                json: function() {
                    if (response.length) {
                        res.send(response);
                    } else {
                        res.send({
                            status: 404,
                            message: "No record found"
                        });
                    }
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponseCountByEmpId = function(req, res) {
        associations.tbl_response.findAll({
            include: [associations.tbl_users],
            where: '`tbl_responsetbl_users`.`deletedAt` IS NULL AND `tbl_responsetbl_users`.`empid`= ' + parseInt(req.params.empid, 10)
        }).on("success", function(response) {
            res.format({
                json: function() {
                    res.send({
                        count: response.length,
                    });
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponsesByGreetId = function(req, res) {
        associations.tbl_response.findAll({
            include: [associations.tbl_users, associations.tbl_greetings],
            where: '`tbl_greetingstbl_response`.`deletedAt` IS NULL AND `tbl_greetingstbl_response`.`greetingid`= ' + parseInt(req.params.gid, 10)
        }).on("success", function(response) {
            res.format({
                json: function() {
                    if (response.length) {
                        res.send(response);
                    } else {
                        res.send({
                            status: 404,
                            message: "No record found"
                        });
                    }
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponsesByGreetIdCount = function(req, res) {
        associations.tbl_response.findAll({
            include: [associations.tbl_greetings],
            where: '`tbl_greetingstbl_response`.`deletedAt` IS NULL AND `tbl_greetingstbl_response`.`greetingid`= ' + parseInt(req.params.gid, 10)
        }).on("success", function(response) {
            res.format({
                json: function() {
                    res.send({
                        count: response.length,
                    });
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponsesByGreetIdCountAll = function(req, res) {
        var whereCondition = '`tbl_greetings`.`deletedAt` IS NULL AND `tbl_greetingstbl_users`.`deletedAt` IS NULL',
            parsedId = parseInt(req.params.empid, 10);
        if (parsedId) {
            whereCondition += ' AND `tbl_greetingstbl_users`.empid = ' + parsedId;
        }
        associations.tbl_greetings.findAll({
            include: [associations.tbl_users],
            where: whereCondition
        }).on("success", function(greetings) {
            var responsesByGreetings = [],
                sortedResponse,
                counter = 0;
            _.each(greetings, function(greeting) {
                ++counter;
                associations.tbl_greetingstbl_response.findAndCountAll({
                    where: {
                        greetingid: greeting.id
                    }
                }).on('success', function(result) {
                    var returnObj = greeting.selectedValues;
                    returnObj.count = result.count;
                    returnObj.tblUsers = greeting.tblUsers[0];
                    responsesByGreetings.push(returnObj);
                    sortedResponse = _.sortBy(responsesByGreetings, function(g) {
                        return -g.count;
                    });
                    --counter;
                    if (counter === 0) {
                        res.format({
                            json: function() {
                                res.send(sortedResponse);
                            }
                        });
                    }
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };
    exports.getResponsesByGreetIdCountByEmpId = function(req, res) {
        exports.getResponsesByGreetIdCountAll(req, res);
    };
}(exports));