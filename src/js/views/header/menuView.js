define(['backbone', 'events', 'template!templates/header/menu', 'utilities/cookieManager','Handlebars'],
function(Backbone, Events, headerMenuTemplate, cookieManager, Handlebars) {
    'use strict';

    Handlebars.registerHelper('activateClass',function(x,y){
        return x===y?'class=\"active\"':'';
    });

    return Backbone.View.extend({

        el: '.main-menu-container',

        initialize: function() {
            if (cookieManager.isAuthenticated()) {
                this.email = cookieManager.checkEmail();
                this.isAdmin = cookieManager.isAdmin();
            }
            Events.on('refreshActiveState', this.refreshState, this);
        },

        events:{
            'click .mainNav li a': 'toggleActive'
        },

        toggleActive:function(e){
            var target$ = this.$(e.target);
            target$.closest('.mainNav').find('li.active').removeClass('active');
            target$.closest('li').toggleClass('active');
        },

        refreshState:function(){
            var anchor$ = this.$('.mainNav').find('a[href=#'+ Backbone.history.fragment +']'),
                li$= anchor$.closest('li');
            if(!li$.hasClass('active')){
                li$.addClass('active');
                li$.siblings('li').removeClass('active');
            }
        },

        render: function() {
            this.$el.html(headerMenuTemplate({
                email: this.email,
                isAdmin: this.isAdmin,
                bbFragment: Backbone.history.fragment
            }));
        }
    });


});