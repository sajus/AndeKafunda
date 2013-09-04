(function(exports) {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_users = sequelize.import(__dirname + '\\..\\models\\create\\tbl_users');

    function errorHandler(error, res) {
        console.error(error.message);
        res.format({
            json: function() {
                res.send(error.message);
            }
        });
    }

    exports.createUser = function(req, res) {
        var requestBody = req.body;
        tbl_users.create(requestBody).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getUsersList = function(req, res) {
        tbl_users.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'id',
                'empid',
                'email',
                'firstname',
                'lastname',
                'accesstype'
            ]
        }).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getUsersById = function(req, res) {
        tbl_users.find({
            where: {
                empid: parseInt(req.params.id, 10),
                deletedAt: null
            },
            attributes: [
                'id',
                'empid',
                'email',
                'firstname',
                'lastname',
                'accesstype',
                'password'
            ]
        }).on("success", function(user) {
            res.format({
                json: function() {
                    if (user) {
                        res.send(user);
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

    exports.putUsersById = function(req, res) {
        var requestBody = req.body;
        tbl_users.update(requestBody, {
            id: parseInt(req.params.id, 10)
        }).success(function() {
            tbl_users.find({
                where: {
                    id: parseInt(req.params.id, 10)
                },
                attributes: [
                    'id',
                    'empid',
                    'email',
                    'firstname',
                    'lastname',
                    'accesstype',
                    'password'
                ]
            }).success(function(user) {
                res.send(user);
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.delUserById = function(req, res) {
        tbl_users.destroy({
            empid: parseInt(req.params.id, 10)
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

    exports.getAdmins = function(req, res) {
        tbl_users.findAll({
            where: {
                accesstype: true
            },
            attributes: [
                'id',
                'empid',
                'email',
                'firstname',
                'lastname',
                'accesstype'
            ]
        }).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };
}(exports));