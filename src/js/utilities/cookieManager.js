define(function(require) {
    "use strict";
    require('jqueryCookie');
    var _setSessionCookie = function(data) {
        $.cookie('isAuthenticated', true);
        $.cookie('isAdmin', data.accesstype);
        $.cookie('email', data.email);
        $.cookie('empid', data.id);
    },
        _destroySessionCookie = function() {
            $.removeCookie('isAuthenticated');
            $.removeCookie('isAdmin');
            $.removeCookie('email');
            $.removeCookie('empid');
        },
        _isAuthenticated = function() {
            return $.cookie('isAuthenticated');
        },
        _isAdmin = function() {
            return !!(parseInt($.cookie('isAdmin'), 10));
        },
        _checkEmpid = function() {
            return $.cookie('empid');
        };

    return {
        setSessionCookie: _setSessionCookie,
        destroySessionCookie: _destroySessionCookie,
        isAuthenticated: _isAuthenticated,
        isAdmin: _isAdmin,
        checkEmpid: _checkEmpid
    };
});