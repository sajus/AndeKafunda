define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        dashboardTemplate = require('template!templates/dashboard/dashboard');
    /* Requires with no return */
    require('jqueryCookie');
    return Backbone.View.extend({

        el: '.page',

        render: function() {
            this.$el.html(dashboardTemplate);
        }
    });
});