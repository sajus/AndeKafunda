define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        summaryUserModalTemplate = require('template!templates/user/userSummary');

    return Backbone.View.extend({

        className: "modal hide fade",

        id: "summaryModal",

        render: function() {
            this.$el.html(summaryUserModalTemplate);
            return this;
        }

    });

});