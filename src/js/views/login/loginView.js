define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        BaseView = require('views/BaseView'),
        loginPageTemplate = require('template!templates/login/login'),
        cookieManager = require('utilities/cookieManager');

    /* Requires with no return */
    require('modelBinder');
    require('bootstrapAlert');
    return BaseView.extend({

        el: '.page',

        initialize: function(options) {
            this.options = options || {};
            this._modelBinder = new Backbone.ModelBinder();
            this._isAuthenticated = cookieManager.isAuthenticated();
            if (this._isAuthenticated) {
                Events.trigger("view:navigate", {
                    path: cookieManager.isAdmin() ? "dashboard" : "greetings",
                    options: {
                        trigger: true
                    }
                });
            } else {
                // Hack for login view
                $('body').css('background-image','url(\"../../../../imgs/header-bg.jpg\")');
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

            if (this.options && this.options.authorizationFailed === true) {
                Events.trigger("alert:error", [{
                    message: "You are not authorized to view this page."
                }]);
            }

            return this;
        },

        postData: function() {
            var self = this;
            this.model.save(this.model.toJSON(), {
                success: function(model, response) {
                    if (response.isAuthenticated) {
                        cookieManager.setSessionCookie(response);
                        self.options.accesstype = response.accesstype;
                        Events.trigger('redirectToAuthPage', self.options);
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