define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        BaseView = require('views/BaseView'),
        loginPageTemplate = require('template!templates/login/login');

    /* Requires with no return */
    require('modelBinder');
    require('bootstrapAlert');
    require('jqueryCookie');
    return BaseView.extend({

        el: '.page',

        initialize: function() {
            this._modelBinder = new Backbone.ModelBinder();
            this._isAuthenticated = $.cookie('isAuthenticated');
            if (this._isAuthenticated) {
                Events.trigger("view:navigate", {
                    path: "dashboard",
                    options: {
                        trigger: true
                    }
                });
            } else {
                $('.main-menu-container').remove();
                $('.footer').remove();
                $('.alert-container').remove();
            }
        },

        events: {
            'submit .form-signin': 'processForm',
            'change :input, blue :input': 'processField'
        },

        render: function() {
            this.$el.html(loginPageTemplate);
            this._modelBinder.bind(this.model, this.el);

            Backbone.Validation.bind(this, {
                invalid: this.showError,
                valid: this.removeError
            });

            if (this.options.authorizationFailed === true) {
                Events.trigger("alert:error", [{
                    message: "You are not authorized to view this page."
                }]);
            }

            return this;
        },

        postData: function() {
            this.model.save(this.model.toJSON(), {
                success: function(model, response) {
                    if (response.isAuthenticated) {
                        $.cookie('isAuthenticated', true);
                        $.cookie('email', response.email);
                        Events.trigger('redirectToAuthPage', this.options);
                    } else {
                        Events.trigger("alert:error", [{
                            message: "The email or password you entered is incorrect."
                        }]);
                    }
                },
                error: function(model, response) {
                    Events.trigger("alert:error", [{
                        message: response
                    }]);
                }
            });
        }
    });
});