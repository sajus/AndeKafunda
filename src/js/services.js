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
    var _getResponsesByGreetIdCountAll = function() {
        return _ajax('/greetingsCountAll');
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