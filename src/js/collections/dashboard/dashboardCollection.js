define(['backbone'], function(Backbone) {
    'use strict';
    var DashboardCollection = Backbone.Collection.extend({
        url: function() {
            return Backbone.Model.gateWayUrl + '/interviewList';
        }
    });
    return DashboardCollection;
});