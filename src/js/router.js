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
                Events.on('redirectToAuthPage', this._navigateLoggedUser, this);
                this.currentId = null;
            },

            _navigatePage: function(navigationData) {
                this.navigate(navigationData.path, navigationData.options);
            },

            _navigateLoggedUser: function(options) {
                var appView = Core.create({}, 'AppView', AppView, {
                    skipAuthCheck: true
                });
                appView.render();
                if (options !== undefined && options.accesstype) {
                    this.navigate("dashboard", {
                        trigger: true
                    });
                } else {
                    this.navigate("greetings", {
                        trigger: true
                    });
                }
            },

            routes: {
                '': 'login',
                'login': 'login',
                'logout': 'logout',
                'dashboard': 'dashboard',
                // Default - catch all
                '*actions': 'defaultAction'
            }
        });
    require('jqueryCookie');
    var initialize = function(options) {
        var appView = options.appView,
            router = new AppRouter(options);

        /* Login routes */
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

        /* Dashboard admin */
        router.on('route:dashboard', function() {
            require(['views/dashboard/dashboardView'], function(DashboardPage) {
                var dashboardPage = Core.create(appView, 'DashboardPage', DashboardPage);
                dashboardPage.render();
            });
        });

        /* Default route */
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