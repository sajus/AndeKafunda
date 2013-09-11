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

    exports.createUser = function(req, res) {
        var requestBody = req.body;
        associations.tbl_users.create(requestBody).on("success", function(user) {
            res.format({
                json: function() {
                    res.send(user);
                }
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getDesignersList = function(req, res) {
        associations.tbl_users.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'id',
                'email',
                'firstname',
                'lastname'
            ]
        }).on("success", function(users) {
            var designers = [],
                counter = 0;
            _.each(users, function(user) {
                ++counter;
                associations.tbl_greetingstbl_users.findAndCountAll({
                    where: {
                        empid: user.id
                    }
                }).on('success', function(result) {
                    if (result.count !== 0) {
                        designers.push(user);
                    }
                    --counter;
                    if (counter === 0) {
                        res.format({
                            json: function() {
                                res.send(designers);
                            }
                        });
                    }
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getUsersVoted = function(req, res) {
        associations.tbl_users.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'id',
                'email',
                'firstname',
                'lastname'
            ]
        }).on("success", function(users) {
            var usersNotVoted = [],
                counter = 0;
            _.each(users, function(user) {
                ++counter;
                associations.tbl_responsetbl_users.findAndCountAll({
                    where: {
                        empid: user.id
                    }
                }).on('success', function(result) {
                    if (result.count !== 0) {
                        usersNotVoted.push(user);
                    }
                    --counter;
                    if (counter === 0) {
                        res.format({
                            json: function() {
                                res.send(usersNotVoted);
                            }
                        });
                    }
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getUsersNotVoted = function(req, res) {
        associations.tbl_users.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'id',
                'email',
                'firstname',
                'lastname'
            ]
        }).on("success", function(users) {
            var usersNotVoted = [],
                counter = 0;
            _.each(users, function(user) {
                ++counter;
                associations.tbl_responsetbl_users.findAndCountAll({
                    where: {
                        empid: user.id
                    }
                }).on('success', function(result) {
                    if (result.count === 0) {
                        usersNotVoted.push(user);
                    }
                    --counter;
                    if (counter === 0) {
                        res.format({
                            json: function() {
                                res.send(usersNotVoted);
                            }
                        });
                    }
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getUsersList = function(req, res) {
        associations.tbl_users.findAll({
            where: {
                deletedAt: null
            },
            attributes: [
                'id',
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
        associations.tbl_users.find({
            where: {
                id: parseInt(req.params.id, 10),
                deletedAt: null
            },
            attributes: [
                'id',
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

        associations.tbl_users.count({
            where: {
                id: parseInt(req.params.id, 10),
                deletedAt: null
            }
        }).success(function(c) {
            if (c > 0) {
                associations.tbl_users.update(requestBody, {
                    id: parseInt(req.params.id, 10)
                }).success(function() {
                    associations.tbl_users.find({
                        where: {
                            id: parseInt(req.params.id, 10)
                        },
                        attributes: [
                            'id',
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
            } else {
                exports.createUser(req, res);
            }
        });
    };

    exports.delUserById = function(req, res) {
        var delIds = req.params.id.split(',');
        delIds = _.map(delIds, function(val) {
            return parseInt(val, 10);
        });
        associations.tbl_greetingstbl_users.destroy({
            empid: delIds
        }).on('success', function() {
            associations.tbl_responsetbl_users.destroy({
                empid: delIds
            }).on('success', function() {
                associations.tbl_users.destroy({
                    id: delIds
                }).on("success", function() {
                    res.format({
                        json: function() {
                            res.send(req.body);
                        }
                    });
                }).on("error", function(error) {
                    errorHandler(error, res);
                });
            });
        });
    };

    exports.getAdmins = function(req, res) {
        associations.tbl_users.findAll({
            where: {
                accesstype: true,
                deletedAt: null
            },
            attributes: [
                'id',
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