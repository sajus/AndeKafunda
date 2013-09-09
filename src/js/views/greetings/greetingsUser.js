define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        greetingTemplate = require('template!templates/greetings/greetingsUser');

    /* Requires with no return */
    require('bootstraplightbox');

    return Backbone.View.extend({

        el: '.page',

        initialize: function() {
            console.log("in user Greetings");
            var self = this;
            this.collection.fetch({
                success: function() {
                    self.data = self.collection.toJSON();
                    self.render();
                }
            });
        },

        events: {
            'click .greetingCheck': 'greetingCheck',
            'click .submit': 'getResponse'
        },

        render: function() {
            console.log(this.data);
            this.$el.html(greetingTemplate({
                greetings:this.data
            }));
        },

        greetingCheck: function(e) {
            e.stopPropagation();
        },

        getResponse: function() {
            console.log("in response");
            var responseValue = [];
            $('.greetingCheck:checked').each(function() {
                responseValue.push($(this).val());
            });
            console.log(responseValue);
        }
    });
});