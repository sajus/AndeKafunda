define(function(require) {
    var Backbone = require('backbone');

    var _ajax = function(url, data) {
        return $.ajax({
            url: Backbone.Model.gateWayUrl + url,
            data: JSON.stringify(data),
        });
    };

    /* Grreting Services */

    var _getResponseCountById = function(data) {
        return _ajax('/getResponseCount/'+data.id,{});
    };

    return {
        getResponseCountById: _getResponseCountById
    }
});