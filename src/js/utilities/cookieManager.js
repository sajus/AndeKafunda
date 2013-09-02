define(function(require) {
    "use strict";
    require('jqueryCookie');
    var _setSessionCookie = function(data) {
        $.cookie('isAuthenticated', true);
        $.cookie('email', data.email);
    },
        _destroySessionCookie = function() {
            $.removeCookie('isAuthenticated');
            $.removeCookie('email');
        },
        _isAuthenticated = function() {
            return $.cookie('isAuthenticated');
        };

    return {
        setSessionCookie: _setSessionCookie,
        destroySessionCookie: _destroySessionCookie,
        isAuthenticated: _isAuthenticated
    };
});