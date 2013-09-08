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
            where: '`tbl_greetings`.`deletedAt` IS NULL AND `tbl_greetingstbl_users`.`deletedAt` IS NULL'
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
            where: '`tbl_greetingstbl_users`.`deletedAt` IS NULL AND `tbl_greetingstbl_users`.`greetingid`= ' + parseInt(req.params.id, 10)
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

    exports.putGreetingsById = function(req, res) {
        var requestBody = req.body;
        associations.tbl_greetings.update({
            url: requestBody.url
        }, {
            id: parseInt(req.params.id, 10)
        }).on('success', function() {
            associations.tbl_greetings.find({
                include: [associations.tbl_users],
                where: '`tbl_greetingstbl_users`.`greetingid`= ' + parseInt(req.params.id, 10) + ' AND `tbl_greetingstbl_users`.`deletedAt` IS NULL'
            }).on('success', function(greeting) {

                if (greeting.tblUsers[0].get('id') === parseInt(requestBody.empid, 10)) {
                    res.format({
                        json: function() {
                            res.send(req.params.id);
                        }
                    });
                } else {
                    greeting.removeTblUser(greeting.tblUsers[0]).on('success', function() {
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
        }).on("error", function(error) {
            errorHandler(error, res);
        });
    };

    exports.delGreetingsById = function(req, res) {
        var delIds = req.params.id.split(',');
        delIds = _.map(delIds, function(val) {
            return parseInt(val, 10);
        });
        associations.tbl_greetingstbl_users.destroy({
            greetingid: delIds
        }).on('success', function() {
            associations.tbl_greetings.destroy({
                id: delIds
            }).on("success", function() {
                res.format({
                    json: function() {
                        res.send(delIds);
                    }
                });
            }).on("error", function(error) {
                errorHandler(error, res);
            });
        });
    };
}(exports));