define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        _ = require('underscore');
    return _.extend({}, Backbone.Events);
});