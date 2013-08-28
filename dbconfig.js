var Sequelize   = require('sequelize')
, mysql         = require('mysql')
, config        = require('./dbresources')
, db            = config.database
, SQLValue      = ""
, headValues    = [];

var sequelize = new Sequelize(db.name, db.host, db.password, {
    dialect: 'mysql',
    // disable logging; default: console.log
    // logging: true
});

exports.sequelize = sequelize;

/**
  * Database Layer
***/
var tbl_users         = sequelize.import(__dirname + '/models/create/tbl_users')
  , tbl_greetings     = sequelize.import(__dirname + '/models/create/tbl_greetings')
  , tbl_response      = sequelize.import(__dirname + '/models/create/tbl_response');

tbl_users.hasMany(tbl_response, { onDelete: 'cascade', onUpdate: 'cascade' });
tbl_greetings.hasMany(tbl_response, { onDelete: 'cascade', onUpdate: 'cascade' });

csvEngine(csvDirectory);

sequelize.sync().on('success', function() {
    tbl_users
    .bulkCreate([
        {empid:7601, email:'sajus@cybage.com',  firstname: 'Saju', lastname: 'Sasidharan', password: 'sajus', accesstype: 1 },
        {empid:10789, email:'vinayakpat@cybage.com',  firstname: 'Vinayak', lastname: 'Patil', password: 'vinayakpat', accesstype: 0 }
    ])
    .on('success', function(options) {
        console.log("Users Table Created");
    })
});

sequelize.sync().on('success', function() {
    tbl_greetings
    .create(
        {url: '/uploads/google.png'}
    )
    .on('success', function(options) {
        console.log("Greeting Table Created");
    })
});

sequelize.sync().on('success', function() {
    tbl_response
    .create(
        {empid: 7601, greetingid: 1, hasresponse: true}
    )
    .on('success', function(options) {
        console.log("Response Table Created");
    })
});