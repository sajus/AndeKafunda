define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        greetingTemplate = require('template!templates/greetings/greetingsUser'),
        greetingConfirmTemplate = require('template!templates/greetings/greetingConfirm'),
        cookieManager = require('utilities/cookieManager'),
        services = require('services'),
        Handlebars = require('Handlebars'),
        _ = require('underscore');

    /* Requires with no return */
    require('prettyPhoto');
    require('bootstrapModal');

    Handlebars.registerHelper('everyNth', function(context, every, options) {
        var fn = options.fn,
            inverse = options.inverse;
        var ret = "";
        if (context && context.length > 0) {
            for (var i = 0, j = context.length; i < j; i++) {
                var isFirst = i === 0;
                var rowCount = i / every + 1;
                var modZero = i % every === 0;
                ret = ret + fn(_.extend({}, context[i], {
                    isFirst: isFirst,
                    rowCount: rowCount,
                    isModZero: modZero,
                    isModZeroNotFirst: modZero && i > 0,
                    isLast: i === context.length - 1
                }));
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });

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
            'mouseleave .thumb-container': 'toggleTooltip',
            // Pagination events
            'click .pagination':'paginate'
        },

        paginate:function(e){
            e.preventDefault();
            var target$ = this.$(e.target),
                targetLi$ = target$.closest('li'),
                pagination$ = targetLi$.closest('.pagination'),
                pageNumber = parseInt(target$.text(),10),
                totalPages = pagination$.find('li').length-4;
            if(!targetLi$.hasClass('active') && pageNumber){
                this.switchPage(targetLi$, pageNumber, totalPages);
            }else if(!targetLi$.hasClass('disabled')){
                var siblingsLi$ =  targetLi$.siblings('.active');
                pageNumber = parseInt(siblingsLi$.text(),10);
                if(targetLi$.hasClass('nextPage')){
                    // Next case
                    this.switchPage(siblingsLi$.first().next(), pageNumber+1, totalPages);
                }else if(targetLi$.hasClass('previousPage')){
                    // Previous Case
                    this.switchPage(siblingsLi$.first().prev(), pageNumber-1, totalPages);
                }else if(targetLi$.hasClass('begin')){
                    // Begin Case
                    this.switchPage(pagination$.find('.firstPage'), 1, totalPages);
                }else if(targetLi$.hasClass('end')){
                    // End Case
                    this.switchPage(pagination$.find('.lastPage'), totalPages, totalPages);
                }
            }

            if(pagination$.hasClass('top')){
                this.$('.pagination.bottom').html(pagination$.html());
            }else{
                this.$('.pagination.top').html(pagination$.html());
            }
        },

        switchPage: function(targetLi$, pageNumber, totalPages){
            // toggleActive "li" and toggle display "row"
            targetLi$.toggleClass('active').siblings('li.active').toggleClass('active');
            var targetContent = this.$('section.row[data-id=' + pageNumber + ']');
            this.$('section.row.active').toggleClass('active').fadeToggle('slow',function(){
                targetContent.toggleClass('active').fadeToggle('slow');
            });
            this.switchControlsState(targetLi$, pageNumber, totalPages);
        },

        switchControlsState:function(targetLi$, currentPageNumber, totalPages){
            var pagination$ = targetLi$.closest('.pagination');
            pagination$.find('.nextPage').removeClass('disabled');
            pagination$.find('.previousPage').removeClass('disabled');
            pagination$.find('.begin').removeClass('disabled');
            pagination$.find('.end').removeClass('disabled');

            if(currentPageNumber===1){
                pagination$.find('.previousPage').addClass('disabled');
                pagination$.find('.begin').addClass('disabled');
            }else if(currentPageNumber===totalPages){
                pagination$.find('.nextPage').addClass('disabled');
                pagination$.find('.end').addClass('disabled');
            }
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
            this.$('.navigation .counter').text(this.responseArray.length);
            Events.trigger('refreshActiveState');
            // Setup pagination
            this.$('.nextPage').prev('li').addClass('lastPage');
            this.$('.previousPage').addClass('disabled');
            this.$('.begin').addClass('disabled');
            if(this.data.length < 9){
                this.$('.nextPage').addClass('disabled');
                this.$('.end').addClass('disabled');
            }
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

            this.$('.navigation .counter').text(this.responseArray.length);

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
                confirmModal$.on('hidden.bs.modal', function() {
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