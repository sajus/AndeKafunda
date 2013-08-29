(function(exports) {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        tbl_users = sequelize.import(__dirname + '\\..\\models\\create\\tbl_users');

    exports.createUser = function(req, res) {
        var requestBody = req.body;
        tbl_users.create({
            empid: parseInt(requestBody.empid, 10),
            email: requestBody.email,
            firstname: requestBody.firstname,
            lastname: requestBody.lastname,
            accesstype: parseInt(requestBody.accesstype, 10),
            password: requestBody.password
        }).on("success", function(user) {
            res.format({
                json: function() {
                    // console.log(typeof user);
                    res.send(user);
                }
            });
        });
    };

    exports.getUsersList = function(req, res) {
        tbl_users.findAll({
            attributes: [
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
        });
    };

    exports.getUsersById = function(req, res) {
        tbl_users.find({
            where: {
                empid: parseInt(req.params.id, 10)
            },
            attributes: [
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
        });
    };

    exports.putUsersById = function(req, res) {
        var requestBody = req.body;
        tbl_users.update({
            email: requestBody.email,
            firstname: requestBody.firstname,
            lastname: requestBody.lastname,
            accesstype: parseInt(requestBody.accesstype, 10),
            password: requestBody.password
        }, {
            empid: parseInt(req.params.id, 10)
        }).success(function() {
            tbl_users.findAll().success(function(user) {
                res.send(user);
            });
        });
    };

    exports.delUserById = function(req, res) {
        tbl_users.destroy({
            empid: parseInt(req.params.id, 10)
        }).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        });
    };
}(exports));