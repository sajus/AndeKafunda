/*
    The goal of this file is mainly to intialize require.js AMD module loader configuration.
    Your application code should not be here but in apps.js
*/
requirejs.config({
    /*
        The path where your JavaScripts are located.
    */
    baseUrl: './js/',

    map: {
        '*': {
            'css': 'vendors/require/plugins/require-css/css'
        }
    },

    /*
      Path config is also part of Require and allows to define paths for vendors
      not found directly under baseUrl.
      See http://requirejs.org/docs/api.html#config-paths for details.
    */
    paths: {

        /* List of frameworks/libraries to be included in this architecture. */
        'jquery': 'vendors/jquery/jquery',
        'underscore': 'vendors/underscore/underscore',
        'backbone': 'vendors/backbone/backbone',
        'handlebars': 'vendors/handlebars/handlebars',
        'moment': 'vendors/moment/moment',

        /* List of custom files to be loaded in this architecture. */
        'template': 'utilities/handlebars-template-mapper',
        'handlebars_Helpers': 'utilities/handlebars-helpers',
        'templates': '../templates',

        /* List of Backbone plugins */
        'modelValidator': 'vendors/backbone/plugins/backbone-validation',
        'modelBinder': 'vendors/backbone/plugins/backbone-modelbinder',
        /* List of Require plugins */
        'text': 'vendors/require/plugins/text',

        /* List of Bootstrap js plugins */
        'bootstrapAlert': '../bower_components/bootstrap/js/alert',
        'bootstrapDropdown': '../bower_components/bootstrap/js/dropdown',
        'bootstrapTransition': '../bower_components/bootstrap/js/transition',
        'bootstraplightbox': 'vendors/bootstrap/js/bootstrap.lightbox',
        'bootstrapModal': '../bower_components/bootstrap/js/modal',
        'bootstrapCarousel': '../bower_components/bootstrap/js/carousel',
        'bootstrapAffix': '../bower_components/bootstrap/js/affix',
        'bootstrapButton': '../bower_components/bootstrap/js/button',
        'bootstrapCollapse': '../bower_components/bootstrap/js/collapse',
        'bootstrapPopOver': '../bower_components/bootstrap/js/popover',
        'bootstrapScrollSpy': '../bower_components/bootstrap/js/scrollspy',
        'bootstrapTab': '../bower_components/bootstrap/js/tab',
        'bootstrapTooltip': '../bower_components/bootstrap/js/tooltip',

        /* List of jQuery plugins */
        'jqueryCookie': 'vendors/jquery/plugins/jquery.cookie',
        'jqueryAjaxForm': 'vendors/jquery/plugins/jquery.form.min',

        /* FuelUx */

        'fuelux': 'vendors/bootstrap/plugins/fuelux/all',
        'fueluxDataGrid': 'vendors/bootstrap/plugins/fuelux/datagrid',
        'fueluxDataSource': 'vendors/bootstrap/plugins/fuelux/datasource',
        'fueluxComboBox': 'vendors/bootstrap/plugins/fuelux/combobox',
        'fueluxSelectBox': 'vendors/bootstrap/plugins/fuelux/select',
        'fueluxSearchBox': 'vendors/bootstrap/plugins/fuelux/search',
        'util': 'vendors/bootstrap/plugins/fuelux/util',
        'fueluxWizard': 'vendors/bootstrap/plugins/fuelux/wizard'

    },

    /*
        shim config is part of `Require 2.0`_ and allows to Configure the dependencies
        and exports for older, traditional 'browser globals' scripts that do not use
        define() to declare the dependencies and set a module value.
        See http://requirejs.org/docs/api.html#config-shim for more details.
    */
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery']
        },
        modelBinder: {
            deps: ['backbone'],
            exports: 'Backbone.ModelBinder'
        }
    }
});

/* Load app.js to initialize your application module. */
require(['views/app', 'router', 'core'], function(AppView, Router, Core) {
    "use strict";
    var appView = Core.create({}, 'AppView', AppView, {
        skipAuthCheck: true
    });
    appView.render();

    /*
        The router now has a copy of all main appview
    */
    Router.initialize({
        appView: appView
    });
});