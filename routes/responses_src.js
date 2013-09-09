(function(exports) {
    "use strict";
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
        associations.tbl_response.count({
            where: [
                "greetingid = ?", parseInt(req.params.gid, 10)
            ]
        }).on("success", function(response) {
            res.format({
                json: function() {
                    if (response) {
                        res.send({
                            count: response
                        });
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

    exports.getResponsesByGreetIdCountAll = function(req, res) {
        associations.tbl_response.findAll().on("success", function(response) {
            var obj = {},
                arr = _.pluck(response, 'greetingid'),
                i = 0,
                j = arr.length,
                gids = [];
            for (; i < j; i++) {
                if (obj[arr[i]]) {
                    obj[arr[i]]++;
                } else {
                    obj[arr[i]] = 1;
                }
            }
            res.send(obj);
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };
}(exports));