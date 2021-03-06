define(function(require) {

    'use strict';

    var Backbone = require('backbone'),
        Events = require('events');
    require('jqueryCookie');

    return Backbone.View.extend({

        processField: function(e) {
            var target$ = $(e.target),
                fieldNameAttr = target$.attr('name'),
                errorText = target$.closest(".form-group").find("span.help-inline");
            if (errorText.text().length !== 0) {
                errorText.text("");
            }
            this.model.set(fieldNameAttr, target$.val(), {
                validate: true
            });
        },

        processForm: function(e) {
            e.preventDefault();
            if ($(".help-inline").text().length !== 0) {
                $(".help-inline").text("");
            }
            this.$('[data-name=option]').slice(2).each(function() {
                var targetParent$ = $(this).closest('.form-group');
                if ($.trim($(this).val()) === '') {
                    targetParent$.remove();
                }
            });
            if (this.model.isValid(true)) {
                this.postData();
            } else {
                Events.trigger("alert:error", [{
                    message: "Please correct the errors in form!"
                }]);
            }
        },

        showError: function(view, attr, error) {
            var targetView$ = view.$el,
                targetSelector$ = targetView$.find("[name=" + attr + "]"),
                targetParent$ = targetSelector$.closest(".form-group"),
                inlineSpan = targetParent$.find('.help-inline'),
                finalMessage = '';
            if ($.trim(inlineSpan.html()) === '') {
                inlineSpan.append(error);
            } else {
                if (!view.redundantError(inlineSpan.text(), error)) {
                    finalMessage = inlineSpan.text() + ", " + error;
                    inlineSpan.text(finalMessage);
                }
            }
            targetParent$.addClass("error");
        },

        redundantError: function(errorFullText, error) {
            var errorList = errorFullText.split(", "),
                returnValue = false;
            errorList.forEach(function(value) {
                if (value.toLowerCase() === error.toLowerCase()) {
                    returnValue = true;
                }
            });
            return returnValue;
        },

        removeError: function(view, attr) {
            var targetView$ = view.$el,
                targetSelector$ = targetView$.find("[name=" + attr + "]"),
                targetParent$ = targetSelector$.closest(".form-group");
            targetParent$.find(".help-inline").html("");
            targetParent$.removeClass("error");
        }
    });
});