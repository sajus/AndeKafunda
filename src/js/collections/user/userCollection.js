define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        userModel = require('models/user/userCreateEditModel');

    return Backbone.Collection.extend({
        initialize: function(options) {
            if (options) {
                this.isDesigner = options.isDesigner;
            }
        },
        url: function() {
            return Backbone.Model.gateWayUrl + ((this.isDesigner) ? '/getDesigners' : '/getUsers');
        },

        model: userModel
    });
});