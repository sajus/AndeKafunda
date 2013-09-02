define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Core = require('core'),
        $ = require('jquery'),
        Events = require('events'),
        AppView = require('views/app'),
        AppRouter = Backbone.Router.extend({

            initialize: function() {
                Events.on('page:navigate', this._navigatePage, this);
                Events.on('redirectToAuthPage', this._navigateAdmin, this);
                this.currentId = null;
            },

            _navigatePage: function(navigationData) {
                this.navigate(navigationData.path, navigationData.options);
            },

            _navigateAdmin: function(options) {
                var appView = Core.create({}, 'AppView', AppView, {
                    skipAuthCheck: true
                });
                appView.render();
                if (options !== undefined && options.targetView !== undefined) {
                    this.navigate("dashboard", {
                        trigger: true
                    });
                } else {
                    this.navigate("dashboard", {
                        trigger: true
                    });
                }
            },

            routes: {
                '': 'login',
                'login': 'login',
                'logout': 'logout',
                // Default - catch all
                '*actions': 'defaultAction'
            }
        });
    require('jqueryCookie');
    var initialize = function(options) {
        var appView = options.appView,
            router = new AppRouter(options);

        router.on('route:login', function() {
            require(['views/login/loginView', 'models/login/loginModel'], function(LoginPage, LoginModel) {
                var loginModel = new LoginModel(),
                    loginPage = Core.create(appView, 'LoginPage', LoginPage, {
                        model: loginModel,
                        skipAuthCheck: true
                    });
                loginPage.render();
            });
        });

        router.on('route:logout', function() {
            $.removeCookie('isAuthenticated');
            Events.trigger("view:navigate", {
                path: "login",
                options: {
                    trigger: true,
                    skipAuthCheck: true
                }
            });
        });

        router.on('route:defaultAction', function() {
            require(['views/defaultAction/defaultAction'], function(DefaultAction) {
                var defaultAction = Core.create(appView, 'DefaultPage', DefaultAction);
                defaultAction.render();
            });
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});