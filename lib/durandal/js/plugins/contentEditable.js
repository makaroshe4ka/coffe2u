define([
    'knockout',
    'jquery'
], function (
    ko,
    $) {

        'use strict';

        return {
            install: function () {
                ko.bindingHandlers.contentEditable = {
                    init: function (element, valueAccessor, allBindings) {
                        var event = allBindings.get('updateOn') || 'blur';

                        $(element).on(event, function () {
                            var observable = valueAccessor();
                            observable($(this).text());
                        });
                    },
                    update: function (element, valueAccessor) {
                        var value = ko.utils.unwrapObservable(valueAccessor());
                        $(element).text(value);
                    }
                };
            }

        };
    });



