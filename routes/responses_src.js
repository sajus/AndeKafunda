(function(exports) {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_respose = sequelize.import(__dirname + '\\..\\models\\create\\tbl_response'),
        tbl_greetings = sequelize.import(__dirname + '\\..\\models\\create\\tbl_greetings'),
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
        tbl_respose.create(requestBody).on("success", function(response) {
            res.format({
                json: function() {
                    res.send(response);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getResponsesList = function(req, res) {
        tbl_respose.findAll().on("success", function(response) {
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
        tbl_respose.findAll({
            where: {
                empid: parseInt(req.params.empid, 10)
            }
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

    exports.getResponsesByGreetId = function(req, res) {
        tbl_respose.findAll({
            where: {
                greetingid: parseInt(req.params.gid, 10)
            }
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
        tbl_respose.count({
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
        tbl_respose.findAll().on("success", function(response) {
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