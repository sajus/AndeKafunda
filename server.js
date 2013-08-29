(function() {
    "use strict";
    var express = require('express'),
        http = require('http'),
        app = express(),
        authorization = require('./routes/authorization_src'),
        users = require('./routes/users_src'),
        config = require("./dbresources"),
        db = config.database;

    app.configure(function() {
        app.set('host', 'cybage.ims.com');
        app.set('port', process.env.PORT || db.port);
        app.use(express.bodyParser());
        app.set(express.methodOverride());
        app.set(express.router);
        app.use(express.static(__dirname + '/src'));
    });
    app.post('/checkAuthorization', authorization.postAuthorization);
    app.post('/getUsers', users.createUser);
    app.get('/getUsers', users.getUsersList);
    app.get('/getUsers/:id', users.getUsersById);
    app.put('/getUsers/:id', users.putUsersById);
    app.del('/getUsers/:id', users.delUserById);

    http.createServer(app).listen(app.get('port'), function() {
        console.log("\n\n\tNode (Express) server listening on port " + app.get('port'));
    });
}());