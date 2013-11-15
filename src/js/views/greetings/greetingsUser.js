define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        greetingTemplate = require('template!templates/greetings/greetingsUser'),
        greetingConfirmTemplate = require('template!templates/greetings/greetingConfirm'),
        cookieManager = require('utilities/cookieManager'),
        services = require('services');

    /* Requires with no return */
    require('bootstraplightbox');

    return Backbone.View.extend({

        el: '.page',

        initialize: function() {
            var self = this,
                empid = cookieManager.checkEmpid();
            this.response = false;
            services.getResponseCountById({
                id: empid
            }).then(function(data){
                if(data.count !== 0) {
                    self.response = true;
                }
            }, function() {
                console.error("error");
            });
            this.collection.fetch({
                success: function() {
                    self.data = self.collection.toJSON();
                    self.render();
                }
            });
        },

        events: {
            'click .greetingCheck': 'greetingCheck',
            'click .submit': 'getResponse',
            'click .confirmGreeting': 'confirmGreeting'
        },

        refreshView: function() {
            this.$el.html(greetingTemplate({
                greetings:this.data,
                response: true
            }));
        },

        render: function() {
            this.$el.html(greetingTemplate({
                greetings:this.data,
                response: this.response
            }));
            Events.trigger('refreshActiveState');
        },

        greetingCheck: function() {
            var responseValue = [];
            $('.greetingCheck:checked').each(function() {
                responseValue.push($(this).val());
            });
            if(responseValue.length === 0) {
                $('.submit').prop('disabled', true).addClass('disabled');
            } else {
                $('.submit').removeProp('disabled').removeClass('disabled');
            }
        },

        getResponse: function() {
            this.$('.modal-container').html(greetingConfirmTemplate);
            this.$('.modal').modal({
                backdrop: 'static'
            });
        },

        confirmGreeting: function() {
            var self = this,
                responseValue = [];
            $('.greetingCheck:checked').each(function() {
                responseValue.push($(this).val());
            });
            if(responseValue.length === 0) {
                Events.trigger("alert:error", [{
                    message: "No greetings selected"
                }]);
            } else {
                var confirmModal$ = this.$('.modal-container .modal');
                Events.trigger("alert:success", [{
                    message: "Greeting submited successfully."
                }]);
                setTimeout(function() {
                    confirmModal$.modal('hide');
                }, 1500);
                confirmModal$.on('hidden', function() {
                    self.refreshView();
                });
            }
            services.createResponse({
                empid: cookieManager.checkEmpid(),
                greetingid: responseValue
            }).done(function(response) {
                console.log(response);
            });
            console.log(responseValue);
        }
    });
});