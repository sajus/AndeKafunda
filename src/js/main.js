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
            'css': '../../bower_components/requirejs-text/text'
        }
    },

    /*
      Path config is also part of Require and allows to define paths for vendors
      not found directly under baseUrl.
      See http://requirejs.org/docs/api.html#config-paths for details.
    */
    paths: {

        /* List of frameworks/libraries to be included in this architecture. */
            'jquery': '../../bower_components/jquery/jquery.min',
            'underscore': '../../bower_components/underscore/underscore-min',
            'backbone': '../../bower_components/backbone/backbone-min',
            'Handlebars': '../../bower_components/handlebars/handlebars.min',
            'moment': '../../bower_components/momentjs/moment',

        /* List of custom files to be loaded in this architecture. */
            'template': '../../bower_components/requirejs-handlebars/hbars',
            'handlebars_Helpers': 'utilities/handlebars-helpers',
            'templates': '../templates',

        /* List of Backbone plugins */
            'modelValidator': '../../bower_components/backbone-validation/src/backbone-validation',
            'modelBinder': '../../bower_components/Backbone.ModelBinder/Backbone.ModelBinder.min',

        /* List of Require plugins */
            'text': '../../bower_components/requirejs-text/text',

        /* List of Bootstrap js plugins */
            'bootstrapAlert': '../../bower_components/bootstrap/js/alert',
            'bootstrapDropdown': '../../bower_components/bootstrap/js/dropdown',
            'bootstrapTransition': '../../bower_components/bootstrap/js/transition',
            'bootstraplightbox': 'vendors/bootstrap/js/bootstrap.lightbox',
            'bootstrapModal': '../../bower_components/bootstrap/js/modal',
            'bootstrapCarousel': '../../bower_components/bootstrap/js/carousel',
            'bootstrapAffix': '../../bower_components/bootstrap/js/affix',
            'bootstrapButton': '../../bower_components/bootstrap/js/button',
            'bootstrapCollapse': '../../bower_components/bootstrap/js/collapse',
            'bootstrapPopOver': '../../bower_components/bootstrap/js/popover',
            'bootstrapScrollSpy': '../../bower_components/bootstrap/js/scrollspy',
            'bootstrapTab': '../../bower_components/bootstrap/js/tab',
            'bootstrapTooltip': '../../bower_components/bootstrap/js/tooltip',

        /* List of jQuery plugins */
            'jqueryCookie': '../../bower_components/jquery-cookie/jquery.cookie',
            'jqueryAjaxForm': '../../bower_components/jquery-form/jquery.form',
            'chosen': '../../bower_components/chosen/public/chosen.jquery.min',
            'prettyPhoto': '../../bower_components/prettyphoto-master/js/jquery.prettyPhoto',

        /* FuelUx */
            'fuelux': '../../bower_components/fuelux/dist/all.min',
            'fueluxDataGrid': '../../bower_components/fuelux/dist/datagrid',
            'fueluxDataSource': '../../bower_components/fuelux/sample/datasource',
            'fueluxComboBox': '../../bower_components/fuelux/dist/combobox',
            'fueluxSelectBox': '../../bower_components/fuelux/dist/select',
            'fueluxSearchBox': '../../bower_components/fuelux/dist/search',
            'util': '../../bower_components/fuelux/dist/util',
            'fueluxWizard': '../../bower_components/fuelux/dist/wizard'
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
        Handlebars: {
            exports: 'Handlebars'
        },
        bootstrap: {
            deps: ['jquery']
        },

        /* Bootstrap plugins */
            bootstrapAlert: {
                deps: ['jquery']
            },
            bootstrapDropdown: {
                deps: ['jquery']
            },
            bootstrapTransition: {
                deps: ['jquery']
            },
            bootstraplightbox: {
                deps: ['jquery']
            },
            bootstrapModal: {
                deps: ['jquery']
            },
            bootstrapCarousel: {
                deps: ['jquery']
            },
            bootstrapAffix: {
                deps: ['jquery']
            },
            bootstrapButton: {
                deps: ['jquery']
            },
            bootstrapCollapse: {
                deps: ['jquery']
            },
            bootstrapPopOver: {
                deps: ['jquery']
            },
            bootstrapScrollSpy: {
                deps: ['jquery']
            },
            bootstrapTab: {
                deps: ['jquery']
            },
            bootstrapTooltip: {
                deps: ['jquery']
            },

        modelBinder: {
            deps: ['backbone'],
            exports: 'Backbone.ModelBinder'
        },
        modelValidator:{
            deps: ['backbone'],
            exports: 'Backbone.Validation'
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