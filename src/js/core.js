define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Events = require('events'),
        Globals = require('globals'),
        LoginView = require('views/login/loginView'),
        LoginModel = require('models/login/loginModel'),
        AccessForbidenView = require('views/defaultAction/accessForbiden'),
        _ = require('underscore'),
        globals = {},
        views = {},
        user = [],
        create = null;

    require('jqueryCookie');
    _.extend(Backbone.Model, {
        gateWayUrl: "http://" + document.domain + ":" + Globals.gateWayPort
    });

    create = function(context, name, View, options) {
        if (views[name] !== undefined) {
            /* remove the view and append the .page immediately in DOM */
            if (name.toLowerCase() !== 'appview') {
                views[name].remove();
                if (!$('.page').length) {
                    $('<div></div>', {
                        class: 'page'
                    }).insertBefore('.footer');
                }
            }
            /* Clean dom events hash */
            views[name].undelegateEvents();
            /* Cleans triggers from  view */
            views[name].unbind();
            if (typeof views[name].onClose === 'function') {
                views[name].onClose();
            }
            delete views[name];
        }

        var skipAuthCheck = false,
            accesslevel = $.cookie('accesslevel'),
            loginModel = null,
            view = null;

        if (options !== undefined) {
            if (options.skipAuthCheck) {
                skipAuthCheck = true;
            }
        }
        if (!$.cookie('isAuthenticated') && !skipAuthCheck) {
            loginModel = new LoginModel();
            view = new LoginView({
                model: loginModel,
                authorizationFailed: !skipAuthCheck,
                targetView: View,
                targetOptions: options
            });
        } else if ((accesslevel === "admin" && name === "userPage") || (accesslevel === "user" && _.contains(user, name))) {
            view = new AccessForbidenView();
            Events.trigger("view:navigate", {
                path: "accessForbiden",
                options: {
                    trigger: true
                }
            });
        } else {
            view = new View(options);
        }

        views[name] = view;
        return view;
    };

    return {
        create: create,
        globals: globals
    };


});