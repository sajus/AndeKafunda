define(['backbone', 'template!templates/footer/footer'], function(Backbone, footerTemplate) {
    'use strict';
    var FooterView = Backbone.View.extend({

        el: '.footer',

        render: function() {
            this.$el.html(footerTemplate);
        }

    });

    return FooterView;
});