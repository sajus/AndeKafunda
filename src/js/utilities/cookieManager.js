define(function(require) {
    "use strict";
    require('jqueryCookie');
    var _setSessionCookie = function(data) {
        $.cookie('isAuthenticated', true);
        $.cookie('isAdmin', data.accesstype);
        $.cookie('email', data.email);
    },
        _destroySessionCookie = function() {
            $.removeCookie('isAuthenticated');
            $.removeCookie('isAdmin');
            $.removeCookie('email');
        },
        _isAuthenticated = function() {
            return $.cookie('isAuthenticated');
        },
        _isAdmin = function() {
            return !!(parseInt($.cookie('isAdmin'), 10));
        };

    return {
        setSessionCookie: _setSessionCookie,
        destroySessionCookie: _destroySessionCookie,
        isAuthenticated: _isAuthenticated,
        isAdmin: _isAdmin
    };
});