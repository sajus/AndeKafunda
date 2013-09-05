define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        userModel = require('models/user/userCreateEditModel');

    return Backbone.Collection.extend({
        url: function() {
            return Backbone.Model.gateWayUrl + '/getUsers';
        },

        model: userModel
    });
});
