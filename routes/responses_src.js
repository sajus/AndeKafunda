(function(exports) {
    'use strict';
    var associations = require('./associations'),
        _ = require('underscore');

    function errorHandler(error, res) {
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
                    response.addTblUser(user).on('success', function() {
                        associations.tbl_greetings.findAll({
                            where: {
                                id: requestBody.greetingid
                            }
                        }).success(function(greetings) {
                            var counter = 0;
                            _.each(greetings, function(greeting) {
                                ++counter;
                                response.addTblGreeting(greeting).on('success', function() {
                                    --counter;
                                    if (counter === 0) {
                                        res.format({
                                            json: function() {
                                                res.send({
                                                    responseid: response.id
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        });
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
                        count: response.length
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
                        count: response.length
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

    exports.getResponsesGreetingsByEmpId = function(req, res) {
        var responseMain = [];
        console.log(req.params.empid === "NaN");
        if (req.params.empid === "NaN") {
            exports.getResponsesByGreetIdCountAll(req, res);
        } else {
            associations.tbl_responsetbl_users.findAll({
                where: {
                    empid: parseInt(req.params.empid, 10),
                    deletedAt: null
                }
            }).on('success', function(responseId) {
                associations.tbl_greetingstbl_response.findAll({
                    where: {
                        responseid: responseId[0].dataValues.responseid
                    }
                }).on('success', function(responseList) {
                    var responseListCounter = responseList.length;
                    _.each(responseList, function(response) {
                        associations.tbl_greetings.findAll({
                            where: {
                                id: response.dataValues.greetingid
                            }
                        }).on('success', function(greetingUrl) {
                            associations.tbl_greetingstbl_users.findAll({
                                where: {
                                    greetingid: response.dataValues.greetingid
                                }
                            }).on('success', function(greetingValues) {
                                associations.tbl_users.findAll({
                                    where: {
                                        id: greetingValues[0].dataValues.empid
                                    }
                                }).on('success', function(users) {
                                    var responseObj = {
                                        id: response.dataValues.greetingid,
                                        count: 1,
                                        url: greetingUrl[0].dataValues.url
                                    };
                                    responseObj.tblUsers = users[0].dataValues;
                                    responseMain.push(responseObj);
                                    --responseListCounter;
                                    if (responseListCounter === 0) {
                                        res.send(responseMain);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
    };
}(exports));