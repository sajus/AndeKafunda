var Sequelize   = require('sequelize')
, mysql         = require('mysql')
, config        = require('./dbresources')
, db            = config.database;

var sequelize = new Sequelize(db.name, db.host, db.password, {
    /**
      * custom host; default: localhost
    ***/
    // host: 'my.server.tld',

    /**
      * The sql dialect of the database. default is 'mysql'
      * currently supported: 'mysql', 'sqlite', 'postgres'
    ***/
    dialect: 'mysql',

    /**
      * Disable logging; default: console.log
    ***/
    logging: true,


    /**
      * Specify options, which are used when sequelize.define is called.
      * Below you can see the possible keys for settings.
    ***/
    define: {
        engine: 'INNODB',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
        paranoid: true
    }

    /**
      * Use pooling in order to reduce db connection overload and to increase speed
      * currently only for mysql and postgresql (since v1.5.0)
    ***/
    // pool: { maxConnections: 5, maxIdleTime: 30 }

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
tbl_users.hasMany(tbl_greetings, { onDelete: 'cascade', onUpdate: 'cascade' });


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
        {empid: 7601, url: '/uploads/google.png'}
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