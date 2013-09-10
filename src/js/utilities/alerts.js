define(function(require) {
    'use strict';
    var AlertModel = require('models/alerts'),

        _render = function(alert) {
            var message = [{
                message: alert.messages
            }],
                alertModel;

            if (alert.messages[0].message) {
                message = alert.messages;
            }

            alertModel = new AlertModel({
                type: alert.type,
                messages: message
            });
            return alertModel;
        };

    return {
        'render': _render
    };

});