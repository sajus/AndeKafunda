define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        GreetingModel = require('models/greetings/greeting');
    return Backbone.Collection.extend({
        model: GreetingModel,
        url: function() {
            return Backbone.Model.gateWayUrl + '/getGreetings';
        }
    });
});