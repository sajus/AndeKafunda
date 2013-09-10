define(function(require) {
    'use strict';
    var Backbone = require('backbone');

    var _ajax = function(url, data) {
        return $.ajax({
            url: Backbone.Model.gateWayUrl + url,
            data: JSON.stringify(data),
        });
    };

    /* Grreting Services */
    var _getResponseCountById = function(data) {
        return _ajax('/getResponseCount/' + data.id, {});
    };

    /* Response services */
    var _getResponsesByGreetIdCountAll = function(data) {
        var path = '/greetingsCountAll';
        if (data) {
            path += '/' + data.empid;
        }
        return _ajax(path);
    };

    var _getUsersNotVoted = function() {
        return _ajax('/getUsersNotVoted');
    };
    return {
        getResponseCountById: _getResponseCountById,
        getResponsesByGreetIdCountAll: _getResponsesByGreetIdCountAll,
        getUsersNotVoted: _getUsersNotVoted
    };
});