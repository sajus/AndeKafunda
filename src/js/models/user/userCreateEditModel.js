define(function(require) {

    'use strict';
    var Backbone = require('backbone'),
        _ = require('underscore');
    require('modelValidator');

    return Backbone.Model.extend({
        urlRoot: function() {
            return Backbone.Model.gateWayUrl + '/getUsers';
        },

        validation: {
            id: [{
                required: true,
                msg: 'Please enter Employee Id!!'
            }, {
                pattern: '^[0-9_-]{4,5}$',
                msg: 'Please enter valid Employee Id with atleast 4 digits!!'
            }],
            firstname: [{
                required: true,
                msg: 'Please enter your First name!!'
            }, {
                pattern: '^[a-zA-Z]{3,50}$',
                msg: 'Please enter valid name with atleast 3 characters!!'
            }],
            lastname: [{
                required: true,
                msg: 'Please enter your Last name!!'
            }, {
                pattern: '^[a-zA-Z]{3,50}$',
                msg: 'Please enter valid name with atleast 3 characters!!'
            }],
            email: [{
                required: true,
                msg: 'Please enter Email Id!!'
            }, {
                pattern: 'email',
                msg: 'Please enter valid Email id!!'
            }],
            password: [{
                required: true,
                msg: 'Please enter password!!'
            }, {
                rangeLength: [6, 100],
                msg: 'Please enter valid password with atleast 8 characters and max 40 characters!!'
            }]
        }
    });
});