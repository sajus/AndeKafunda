(function(exports) {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_greetings = sequelize.import(__dirname + '\\..\\models\\create\\tbl_greetings');

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
        tbl_greetings.create(requestBody).on("success", function(greeting) {
            res.format({
                json: function() {
                    res.send(greeting);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getGreetingsList = function(req, res) {
        tbl_greetings.findAll({
            where: {
                deletedAt: null
            }
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
        tbl_greetings.find({
            where: {
                id: parseInt(req.params.id, 10),
                deletedAt: null
            }
        }).on("success", function(greeting) {
            res.format({
                json: function() {
                    if (greeting) {
                        res.send(greeting);
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

    exports.putGreetingsById = function(req, res) {
        var requestBody = req.body;
        tbl_greetings.update(requestBody, {
            id: parseInt(req.params.id, 10)
        }).success(function() {
            tbl_greetings.find({
                where: {
                    id: parseInt(req.params.id, 10)
                },
                attributes: [
                    'id',
                    'empid',
                    'url'
                ]
            }).success(function(greeting) {
                res.send(greeting);
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.delGreetingsById = function(req, res) {
        tbl_greetings.destroy({
            id: parseInt(req.params.id, 10)
        }).on("success", function() {
            res.format({
                json: function() {
                    res.send(req.params.id);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };
}(exports));