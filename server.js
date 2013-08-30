(function() {
    "use strict";
    var express = require('express'),
        http = require('http'),
        app = express(),
        authorization = require('./routes/authorization_src'),
        users = require('./routes/users_src'),
        greetings = require('./routes/greetings_src'),
        responses = require('./routes/responses_src'),
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
    /*Authorization Call*/
    app.post('/checkAuthorization', authorization.postAuthorization);

    /*Users Calls*/
    app.post('/getUsers', users.createUser);
    app.get('/getUsers', users.getUsersList);
    app.get('/getUsers/:id', users.getUsersById);
    app.put('/getUsers/:id', users.putUsersById);
    app.del('/getUsers/:id', users.delUserById);

    /*Admin Call*/
    app.get('/getAdmins', users.getAdmins);

    /*Greeting Calls*/
    app.post('/getGreetings', greetings.createGreeting);
    app.get('/getGreetings', greetings.getGreetingsList);
    app.get('/getGreetings/:id', greetings.getGreetingsById);
    app.put('/getGreetings/:id', greetings.putGreetingsById);
    app.del('/getGreetings/:id', greetings.delGreetingsById);

    /*Respose Calls*/
    app.post('/getResponses', responses.createResponse);
    app.get('/getResponses', responses.getResponsesList);
    app.get('/getResponses/:empid', responses.getResponsesByEmpId);
    app.get('/getResponses/greetings/:gid', responses.getResponsesByGreetId);
    app.get('/getResponses/greetingsCount/:gid', responses.getResponsesByGreetIdCount);
    app.get('/greetingsCountAll', responses.getResponsesByGreetIdCountAll);

    http.createServer(app).listen(app.get('port'), function() {
        console.log("\n\n\tNode (Express) server listening on port " + app.get('port'));
    });
}());