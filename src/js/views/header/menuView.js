define(['backbone', 'template!templates/header/menu','utilities/cookieManager'], function(Backbone, headerMenuTemplate, cookieManager){

    var HeaderMenuView = Backbone.View.extend({

        el: '.main-menu-container',

        initialize:function(){
            if(cookieManager.isAuthenticated()) {
                this.email = cookieManager.checkEmail();
                this.isAdmin = cookieManager.isAdmin();
            }
        },

        render: function () {
            this.$el.html(headerMenuTemplate({
                email:this.email,
                isAdmin: this.isAdmin
            }));
        }
    })

    return HeaderMenuView;
});
