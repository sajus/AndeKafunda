define(['backbone', 'models/projectsModel'], function(Backbone, ProjectsModel) {
    'use strict';
    return Backbone.Collection.extend({

        model: ProjectsModel

    });

});