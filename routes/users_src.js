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
                        empid: user.id,
                        deletedAt: null
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
                        empid: user.id,
                        deletedAt: null
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
        var delIds = req.params.id.split(','),
            userCounter = 0;
        delIds = _.map(delIds, function(val) {
            return parseInt(val, 10);
        });
        associations.tbl_users.findAll({
            where: {
                id: delIds
            }
        }).on('success', function(users) {
            _.each(users, function(user) {
                userCounter++;
                deleteGreetingReferences(user).then(function() {
                    deleteResponseReferences(user).then(function() {
                        user.destroy().on('success', function() {
                            --userCounter;
                            if (userCounter === 0) {
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

    function deleteGreetingReferences(user) {
        var greetingCounter = 0,
            promise = new Promise();
        user.getTblGreetings().on('success', function(greetings) {
            if (greetings.length === 0) {
                promise.resolve("Greeting references for the user deleted successfully");
            } else {
                _.each(greetings, function(greeting) {
                    ++greetingCounter;
                    user.removeTblGreeting(greeting).on('success', function() {
                        associations.tbl_greetingstbl_response.destroy({
                            greetingid: greeting.id
                        }).on('success', function() {
                            deleteGreetingReponses(greeting).then(function() {
                                greeting.destroy().on('success', function() {
                                    --greetingCounter;
                                    console.log('greeting is itself deleted now');
                                    if (greetingCounter === 0) {
                                        promise.resolve("Greeting references for the user deleted successfully");
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
        return promise;
    }

    function deleteGreetingReponses(greeting) {
        var promise = new Promise(),
            responseCounter = 0;
        greeting.getTblResponses().on('success', function(responses) {
            if (responses.length === 0) {
                promise.resolve("All the reponses for the greeting has been deleted");
            } else {
                _.each(responses, function(response) {
                    ++responseCounter;
                    greeting.removeTblResponse(response).on('success', function() {
                        associations.tbl_responsetbl_users.destroy({
                            responseid: response.id
                        }).on('success', function() {
                            response.destroy().on('success', function() {
                                --responseCounter;
                                if (responseCounter === 0) {
                                    promise.resolve("All the reponses for the greeting has been deleted");
                                }
                            });
                        });
                    });
                });
            }
        });
        return promise;
    }

    function deleteResponseReferences(user) {
        var responseCounter = 0,
            promise = new Promise();
        user.getTblResponses().on('success', function(responses) {
            if (responses.length === 0) {
                promise.resolve("Greeting references for the user deleted successfully");
            } else {
                _.each(responses, function(response) {
                    ++responseCounter;
                    user.removeTblResponse(response).on('success', function() {
                        response.destroy().on('success', function() {
                            console.log("response itself is deleted");
                            --responseCounter;
                            if (responseCounter === 0) {
                                promise.resolve("Greeting references for the user deleted successfully");
                            }
                        });
                    });
                });
            }
        });
        return promise;
    }

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