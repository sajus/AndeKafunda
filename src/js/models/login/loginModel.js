// define(['backbone', 'modelValidator'], function(Backbone) {
define(function(require) {

    'use strict';
    var Backbone = require('backbone');

    require('modelValidator');

    return Backbone.Model.extend({
        url: function() {
            return Backbone.Model.gateWayUrl + '/checkAuthorization';
        },

        validation: {
            email: [{
                required: true,
                msg: 'Email is required.'
            }, {
                pattern: 'email',
                msg: 'Please enter valid email'
            }],
            password: [{
                required: true,
                msg: 'Password is required.'
            }, {
                pattern: '^[a-z0-9_-]{3,15}$',
                msg: 'Password should contain min 3 and max 15 characters.'
            }]
        }
    });
});