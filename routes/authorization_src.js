(function() {
    "use strict";
    var sequelize = require('../dbconfig').sequelize,
        _ = require('../libresources').underscore;

    exports.postAuthorization = function(req, res) {
        var email = req.body.email,
            password = req.body.password,
            authorization = null;
        sequelize.query("SELECT email, firstname, lastname,accesstype FROM tbl_users WHERE email='" + email + "' AND password='" + password + "' LIMIT 1 ").success(function(rows) {
            if (rows.length === 0) {
                authorization = _.object([
                    "isAuthenticated"
                ], [
                    false
                ]);
            } else {
                authorization = _.object([
                    "isAuthenticated",
                    "email",
                    "firstname",
                    "lastname",
                    "accesstype"
                ], [
                    true,
                    rows[0].email,
                    rows[0].firstname,
                    rows[0].lastname,
                    rows[0].accesstype
                ]);
            }

            res.format({
                json: function() {
                    res.send(authorization);
                }
            });
        }).error(function(error) {
            console.log("Query Error: " + error);
        });
    };
}());