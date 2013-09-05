define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        Events = require('events'),
        BaseView = require('views/BaseView'),
        userCreateTemplate = require('template!templates/user/userCreate');

    require('modelBinder');

    return BaseView.extend({

        className: "modal hide fade",

        events: {
            'change input[type=text],textarea,select': 'processField',
            'click .createUser': 'processForm'
        },

        initialize: function() {
            this.modelBinder = new Backbone.ModelBinder();
        },

        render: function() {
            this.$el.html(userCreateTemplate);
            this.modelBinder.bind(this.model, this.el);
            Backbone.Validation.bind(this, {
                invalid: this.showError,
                valid: this.removeError
            });
            return this;
        },

        postData: function() {
            var self = this;
            this.model.save(this.model.toJSON(), {
                success: function() {
                    self.$('#createModal').modal('hide');
                    Events.trigger("refreshView");
                    Events.trigger("alert:success", [{
                        message: "User created successfully."
                    }]);
                },
                error: function(model, error) {
                    Events.trigger("alert:error", [{
                        message: error.responseText
                    }]);
                }
            });
        }
    });
});