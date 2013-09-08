define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        confirmModalTemplate = require('template!templates/greetings/admin/confirmModal'),
        Events = require('events');
    /* Requires with no assignment */
    return Backbone.View.extend({
        className: "modal hide fade",
        events: {
            'click .confirmDelete': 'confirmed',
        },
        confirmed: function(e) {
            e.preventDefault();
            Events.trigger('confirmedGreetingDelete');
        },
        render: function(users) {
            this.$el.html(confirmModalTemplate());
            return this;
        }
    });
});