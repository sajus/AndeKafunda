define(['backbone', 'template!templates/header/menu', 'utilities/cookieManager'], function(Backbone, headerMenuTemplate, cookieManager) {
    'use strict';
    return Backbone.View.extend({

        el: '.main-menu-container',

        initialize: function() {
            if (cookieManager.isAuthenticated()) {
                this.email = cookieManager.checkEmail();
                this.isAdmin = cookieManager.isAdmin();
            }
        },

        events:{
            'click .mainNav li a': 'toggleActive'
        },

        toggleActive:function(e){
            var target$ = this.$(e.target);
            target$.closest('.mainNav').find('li.active').removeClass('active');
            target$.closest('li').toggleClass('active');
        },

        render: function() {
            this.$el.html(headerMenuTemplate({
                email: this.email,
                isAdmin: this.isAdmin
            }));
        }
    });
});