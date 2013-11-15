define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        Core = require('core'),
        $ = require('jquery'),
        Events = require('events'),
        cookieManager = require('utilities/cookieManager'),
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
                '(login)': 'login',
                'dashboard': 'dashboard',
                'users': 'users',
                'greetings': 'greetings',
                'reports': 'reports',
                'logout': 'logout',
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

        /* Dashboard admin */
        router.on('route:dashboard', function() {
            require(['views/dashboard/dashboardView'], function(DashboardPage) {
                var dashboardPage = Core.create(appView, 'DashboardPage', DashboardPage);
                dashboardPage.render();
                Events.trigger('refreshActiveState');
            });
        });

        /*User Admin*/
        router.on('route:users', function() {
            require(['views/user/userView', 'collections/user/userCollection'], function(UserPage, UserCollection) {
                var userCollection = new UserCollection();
                var userPage = Core.create(appView, 'UserPage', UserPage, {
                    collection: userCollection
                });
                userPage.render();
                Events.trigger('refreshActiveState');
            });
        });

        /* Greetings Routes */
        router.on('route:greetings', function() {
            var greetingsViewPath = cookieManager.isAdmin() ? 'views/greetings/admin/greetingsAdmin' : 'views/greetings/greetingsUser';
            require([greetingsViewPath, 'collections/greetings/greetings'], function(GreetingsView, GreetingsCollection) {
                var greetingsCollection = new GreetingsCollection();
                Core.create(appView, 'GreetingsView', GreetingsView, {
                    collection: greetingsCollection
                });
            });
        });

        /*Reports Admin*/
        router.on('route:reports', function() {
            require(['views/reports/reportsView'], function(ReportsPage) {
                Core.create(appView, 'ReportsPage', ReportsPage);
            });
        });

        /*Logout Routes*/
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