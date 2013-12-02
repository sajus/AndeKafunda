define(function(require) {
    "use strict";
    require('jqueryCookie');
    var _setSessionCookie = function(data) {
        $.cookie('isAuthenticated', true);
        $.cookie('isAdmin', data.accesstype);
        $.cookie('email', data.email);
        $.cookie('empid', data.id);
        $.cookie('firstname', data.firstname);
        $.cookie('lastname', data.lastname);
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
        },
        _checkEmail = function() {
            return $.cookie('email');
        },
        _getFirstname = function() {
            return $.cookie('firstname');
        };

    return {
        setSessionCookie: _setSessionCookie,
        destroySessionCookie: _destroySessionCookie,
        isAuthenticated: _isAuthenticated,
        isAdmin: _isAdmin,
        checkEmpid: _checkEmpid,
        checkEmail: _checkEmail,
        getFirstname: _getFirstname
    };
});