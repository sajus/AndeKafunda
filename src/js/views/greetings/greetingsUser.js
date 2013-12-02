define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        greetingTemplate = require('template!templates/greetings/greetingsUser'),
        greetingConfirmTemplate = require('template!templates/greetings/greetingConfirm'),
        cookieManager = require('utilities/cookieManager'),
        services = require('services');

    /* Requires with no return */
    require('prettyPhoto');
    require('bootstrapModal');

    return Backbone.View.extend({

        el: '.page',

        initialize: function() {
            var self = this,
                empid = cookieManager.checkEmpid();

            this.responseArray = [];
            this.response = false;

            // Fetch greetings
            services.getResponseCountById({
                id: empid
            }).then(function(data){
                if(data.count !== 0) {
                    self.response = true;
                }
                self.collection.fetch({
                    success: function() {
                        self.data = self.collection.toJSON();
                        self.render();
                    }
                });
            }, function() {
                console.error("error");
            });
        },

        events: {
            'click .submit': 'getResponse',
            'click .voteNow': 'checkGreeting',
            'click .voteTooltip .glyphicon': 'checkGreeting',
            'click .confirmGreeting': 'confirmGreeting',
            'mouseenter .thumb-container': 'toggleTooltip',
            'mouseleave .thumb-container': 'toggleTooltip'
        },

        refreshView: function() {
            this.$el.html(greetingTemplate({
                greetings:this.data,
                response: true
            }));
        },

        toggleTooltip:function(e){
            var target$ = this.$(e.currentTarget);
            target$.find('.greetingTooltip').slideToggle('fast');
            if(!target$.hasClass('checked')){
                target$.find('.voteTooltip').fadeToggle('fast');
            }
        },

        render: function() {
            this.$el.html(greetingTemplate({
                greetings:this.data,
                response: this.response,
                firstname: cookieManager.getFirstname()
            }));
            console.log("Res: "+this.response);
            $('.page').css('margin-top','20px');
            this.$("a[rel^='greetings']").prettyPhoto();
            // Put dates on top
            this.$('.highlight .pull-right').text(new Date().toGMTString());
            // Set the initial counter
            this.$('.modal-footer .counter').text(this.responseArray.length);
            Events.trigger('refreshActiveState');
        },

        checkGreeting: function(e){
            if(this.$(e.target).hasClass('disabled')){
                return false;
            }
            var target$ = this.$(e.target).closest('.thumb-container');
            target$.toggleClass('checked');
            this.greetingCheck(target$);
        },

        greetingCheck: function(target) {
            if(target.hasClass('checked')){
                this.responseArray.push(target.attr('data-id'));
            }else {
                var index = this.responseArray.indexOf(target.attr('data-id'));
                if(index !== -1){
                    this.responseArray.splice(index, 1);
                }
            }

            this.$('.modal-footer .counter').text(this.responseArray.length);

            if(this.responseArray.length === 0) {
                this.$('.submit').prop('disabled', true).addClass('disabled');
            } else {
                this.$('.submit').removeProp('disabled').removeClass('disabled');
            }
        },

        getResponse: function() {
            this.$('.modal-container').html(greetingConfirmTemplate);
            this.$('.modal-container .modal').modal({
                backdrop: 'static'
            });
        },

        confirmGreeting: function() {
            var self = this;
            if(this.responseArray.length === 0) {
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
                greetingid: self.responseArray
            }).done(function(response) {
                console.log(response);
            });
        }
    });
});