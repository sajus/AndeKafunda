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
        db = config.database,
        fs = require('fs');

    app.configure(function() {
        app.set('host', 'cybage.ims.com');
        app.set('port', process.env.PORT || db.port);
        app.use(express.bodyParser({
            uploadDir: __dirname + '/uploads',
            keepExtensions: true
        }));
        app.set(express.methodOverride());
        app.set(express.router);
        app.use(express.static(__dirname + '/src'));
        app.use(express.static(__dirname + '/uploads'));
        app.use(express.limit('2mb'));
    });
    /*Authorization Call*/
    app.post('/checkAuthorization', authorization.postAuthorization);

    /*Users Calls*/
    app.post('/getUsers', users.createUser);
    app.get('/getUsers', users.getUsersList);
    app.get('/getDesigners', users.getDesignersList);
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
    app.get('/getResponseCount/:empid', responses.getResponseCountByEmpId);
    app.get('/getResponses/greetings/:gid', responses.getResponsesByGreetId);
    app.get('/getResponses/greetingsCount/:gid', responses.getResponsesByGreetIdCount);
    app.get('/greetingsCountAll', responses.getResponsesByGreetIdCountAll);

    /* Upload image */
    app.post('/upload', function(req, res) {
        fs.readFile(req.files.file.path, function(err, data) {
            if (err) {
                res.send("<h1>Error in file upload</h1>");
            } else {
                var newPathName = __dirname + '/uploads/' + req.files.file.name;
                fs.rename(req.files.file.path, newPathName, function(err) {
                    if (err) {
                        console.log("error in file upload");
                        fs.unlink(req.files.file.path);
                        res.redirect('#greetings');
                    } else {
                        console.log("file uploaded successfully");
                        res.send('/' + req.files.file.name);
                    }

                });
            }
        });
    });

    http.createServer(app).listen(app.get('port'), function() {
        console.log("\n\n\tNode (Express) server listening on port " + app.get('port'));
    });
}());