(function(exports) {
    "use strict";
    var associations = require('./associations');

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
        associations.tbl_greetings.create({
            url: requestBody.url
        }).on("success", function(greeting) {
            associations.tbl_users.find({
                where: {
                    id: requestBody.empid
                }
            }).success(function(user) {
                greeting.addTblUser(user).on("success", function() {
                    res.format({
                        json: function() {
                            res.send({
                                greetingid: greeting.id
                            });
                        }
                    });
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.getGreetingsList = function(req, res) {
        associations.tbl_greetings.findAll({
            include: [associations.tbl_users],
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
        associations.tbl_greetings.find({
            include: [associations.tbl_users],
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
        associations.tbl_greetings.update({
            url: requestBody.url
        }, {
            id: parseInt(req.params.id, 10)
        }).on('success', function() {
            associations.tbl_greetings.find({
                where: {
                    id: parseInt(req.params.id, 10)
                }
            }).on('success', function(greeting) {
                // console.log(greeting.hasTblUser());
                greeting.getTblUsers().on('success', function(users) {
                    if (users[0].get('id') === requestBody.empid) {
                        res.format({
                            json: function() {
                                res.send(req.params.id);
                            }
                        });
                    } else {
                        greeting.removeTblUser(users[0]).on('success', function() {
                            associations.tbl_users.find({
                                where: {
                                    id: parseInt(requestBody.empid, 10)
                                }
                            }).on('success', function(newArtist) {
                                greeting.addTblUser(newArtist).on('success', function() {
                                    res.format({
                                        json: function() {
                                            res.send(req.params.id);
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.delGreetingsById = function(req, res) {
        associations.tbl_greetings.destroy({
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