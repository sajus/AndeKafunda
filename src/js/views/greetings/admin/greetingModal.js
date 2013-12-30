define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        greetingModalTemplate = require('template!templates/greetings/admin/greetingModal'),
        BaseView = require('views/baseview'),
        Events = require('events');
    /* Requires with no assignment */
    require('modelBinder');
    require('jqueryAjaxForm');
    return BaseView.extend({
        className: "modal fade",
        initialize: function(options) {
            this.options = options || {};
            this._greetingBinder = new Backbone.ModelBinder();
        },
        events: {
            'click .saveGreeting': 'processForm',
            'change .input-file': 'uploadForm'
        },
        fetchData: function() {
            return this.model.fetch();
        },
        postData: function() {
            var postData = {}, self = this;
            /* remove file attribute */
            if (this.options.editMode) {
                postData.empid = this.$('.user').val();
                postData.id = this.model.get('id');
                postData.url = this.model.get('url');
            } else {
                this.model.unset('file');
                this.model.set('empid', parseInt(this.$('.user').val(), 10));
                postData = this.model.toJSON();
            }
            this.model.save(postData, {
                success: function() {
                    Events.trigger('alert:success', [{
                        message: "Greeting saved successfully"
                    }]);
                    setTimeout(function() {
                        self.$el.modal('hide');
                    }, 1500);
                    self.$el.on('hidden.bs.modal', function() {
                        Events.trigger('refreshView');
                    });
                }
            });
        },
        uploadForm: function(e) {
            var target$ = this.$(e.target),
                self = this;
            if (target$.val() === '') {
                return;
            }
            this.$('.form-horizontal').ajaxForm(function(imgUrl) {
                self.$('.uploadedImage').attr('src', imgUrl);
                self.model.set('url', imgUrl, {
                    validate: true
                });
            });
            this.$('.form-horizontal').submit();
        },
        render: function(users) {
            if (this.options.editMode) {
                this.$el.html(greetingModalTemplate({
                    editMode: true,
                    url: this.model.get('url'),
                    users: users
                }));
                /* Bind select box with users */
                this.$('.user').val(this.model.get('tblUsers')[0].id);
            } else {
                this.$el.html(greetingModalTemplate({
                    editMode: false,
                    users: users
                }));
            }
            this._greetingBinder.bind(this.model, this.el);
            /* Bind validators */
            Backbone.Validation.bind(this, {
                invalid: this.showError,
                valid: this.removeError
            });
            return this;
        }
    });
});