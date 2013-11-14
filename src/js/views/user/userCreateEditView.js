define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        Events = require('events'),
        BaseView = require('views/BaseView'),
        userCreateEditTemplate = require('template!templates/user/userCreateEdit');

    require('modelBinder');
    require('bootstrapModal');

    return BaseView.extend({

        events: {
            'change input[type=text],textarea,select': 'processField',
            'click .createEditUser': 'processForm'
        },

        initialize: function() {
            var self = this;
            this.responseText = "Some error in creating new user. Please recheck the form!!";
            this._modelBinder = new Backbone.ModelBinder();
            if (this.options.id !== undefined) {
                this.model.fetch({
                    success: function() {
                        self.model.set('accesstype', self.model.get('accesstype') + '');
                    }
                });
            }
        },

        render: function() {
            if (this.options.id !== undefined) {
                this.$el.html(userCreateEditTemplate({
                    model: this.model.toJSON(),
                    create: false,
                    button: "Update"
                }));
                this.model.set('accesstype', this.model.get('accesstype') + '');
            } else {
                this.model.clear();
                this.$el.html(userCreateEditTemplate({
                    create: true,
                    button: "Create"
                }));
            }
            this._modelBinder.bind(this.model, this.el);
            Backbone.Validation.bind(this, {
                invalid: this.showError,
                valid: this.removeError
            });
            return this;
        },

        postData: function() {
            var accesstype, accessLevel, self = this;
                accesstype = this.model.get("accesstype");
                accessLevel = (accesstype === "true") ? true : false;
                this.model.set('accesstype', accessLevel);
            if (this.options.id !== undefined) {
                this.responseText = "Some error in editing user. Please recheck the form!!";
            }
            this.model.save(this.model.toJSON(), {
                success: function() {
                    var confirmModal$ = self.$('.modal');
                    Events.trigger("alert:success", [{
                        message: "User updated successfully."
                    }]);
                    setTimeout(function() {
                        confirmModal$.modal('hide');
                        Events.trigger("refreshView");
                    }, 1500);
                },
                error: function(model, error) {
                    error.responseText = (error.responseText.length) ? error.responseText : self.responseText;
                    Events.trigger("alert:error", [{
                        message: error.responseText
                    }]);
                    self.model.set('accesstype', self.model.get('accesstype') + '');
                }
            });
        }
    });
});