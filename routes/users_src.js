(function(exports) {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_users = sequelize.import(__dirname + '\\..\\models\\create\\tbl_users');

    exports.createUser = function(req, res) {
        var requestBody = req.body;
        tbl_users.create(requestBody).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        }).on("error", function(error) {
            console.log(error);
        });
    };

    exports.getUsersList = function(req, res) {
        tbl_users.findAll({
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
            console.log(error);
        });
    };

    exports.getUsersById = function(req, res) {
        tbl_users.find({
            where: {
                empid: parseInt(req.params.id, 10)
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
            console.log(error);
        });
    };

    exports.putUsersById = function(req, res) {
        var requestBody = req.body;
        tbl_users.update(requestBody, {
            empid: parseInt(req.params.id, 10)
        }).success(function() {
            tbl_users.find({
                where: {
                    empid: parseInt(req.params.id, 10)
                },
                attributes: [
                    'id',
                    'empid',
                    'email',
                    'firstname',
                    'lastname',
                    'accesstype'
                ]
            }).success(function(user) {
                res.send(user);
            });
        }).on("error", function(error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        });
    };
}(exports));