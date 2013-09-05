define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        Events = require('events'),
        BaseView = require('views/BaseView'),
        userCreateEditPageTemplate = require('template!templates/user/userCreateEdit');

    require('modelBinder');
    require('bootstrapAlert');
    require('jqueryCookie');
    require('modelValidator');

    return BaseView.extend({

        className: "modal hide fade",

        id: "editModal",

        events: {
            'change input[type=text],textarea,select': 'processField',
            'click .update': 'processForm'
        },

        initialize: function() {
            var self = this;
            this._modelBinder = new Backbone.ModelBinder();
            this.model.fetch({
                async: false,
                success: function() {
                    self.render();
                }
            });
        },

        render: function() {
            console.log(this.model.toJSON());
            this.$el.html(userCreateEditPageTemplate({
                model: this.model.toJSON()
            }));
            this.model.set('accesstype', this.model.get('accesstype') + '');
            this._modelBinder.bind(this.model, this.el);
            Backbone.Validation.bind(this, {
                invalid: this.showError,
                valid: this.removeError
            });
            return this;
        },

        postData: function() {
            var self = this,
                accesstype = this.model.toJSON().accesstype;
            if (accesstype === "true") {
                accesstype = true;
            } else {
                accesstype = false;
            }
            this.model.set('accesstype', accesstype);
            this.model.save(this.model.toJSON(), {
                success: function() {
                    self.$('#editModal').modal('hide');
                    Events.trigger("refreshView");
                    Events.trigger("alert:success", [{
                        message: "User updated successfully."
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