define(function(require) {
    "use strict";
    var Backbone = require('backbone');
    require('modelValidator');
    return Backbone.Model.extend({
        urlRoot: function() {
            return Backbone.Model.gateWayUrl + '/getGreetings';
        },
        validation: {
            url: {
                required: true,
                msg: "Greeting file is required"
            }
        },
        parse: function(response) {
            // console.log(response);
            return response;
        }
    });
});