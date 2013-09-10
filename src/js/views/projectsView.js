define(['backbone', 'models/projectsModel', 'modelForm'], function(Backbone, Project) {
    'use strict';
    var project = new Project();

    var form = new Backbone.Form({
        model: project
    }).render();

    return Backbone.View.extend({

        el: '.page',

        render: function() {
            this.$el.html(form.el);
        }
    });

});