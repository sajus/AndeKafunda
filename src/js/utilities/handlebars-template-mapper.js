define(['module'], function(module) {
    'use strict';
    var masterConfig = (module.config && module.config()) || {},
        html = {
            load: function(name, req, load, config) {
                config = config || {};

                var extension = masterConfig.extension,
                    textName;
                if (config.extension) {
                    extension = config.extension;
                }
                extension = extension || 'html';
                textName = 'text!' + name + '.' + extension;

                return req(['handlebars', textName], function(Handlebars, template) {
                    template = Handlebars.compile(template);
                    load(template);
                });
            }
        };

    return html;
});