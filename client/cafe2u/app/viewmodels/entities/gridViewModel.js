define(["require", "exports", "../../common/settings", "lodash", "knockout"], function (require, exports, settings, lodash, ko) {
    "use strict";
    var GridViewModel = (function () {
        function GridViewModel(entityName, templates, filters, headers, callbacks, entityViewModel, initiateUpdate) {
            this.entityName = entityName;
            this.templates = templates;
            this.filters = filters;
            this.headers = headers;
            this.callbacks = callbacks;
            this.entityViewModel = entityViewModel;
            this.initiateUpdate = initiateUpdate;
            this.entityName = entityName;
            this.callbacks = callbacks;
            this.filters = filters;
            this.entityViewModel = entityViewModel;
            this.initiateUpdate = initiateUpdate;
            this.templates = this.fillTemplates(templates);
            this.headers = this.updateHeaders(headers);
        }
        GridViewModel.prototype.fillTemplates = function (templates) {
            if (templates) {
                templates.headerTemplate = templates.headerTemplate || settings.Settings.defaultHeaderTemplate;
                templates.filtersTemplate = templates.filtersTemplate || settings.Settings.defaultFiltersTemplate;
                templates.preHeaderTemplate = templates.preHeaderTemplate || settings.Settings.defaultPreHeaderTemplate;
            }
            return templates;
        };
        GridViewModel.prototype.updateHeaders = function (headers) {
            var result = lodash.map(headers, function (header) {
                header.isAsc = ko.observable(false);
                header.isSort = ko.observable(false);
                return header;
            });
            var index = 0;
            result[index].isSort(true);
            result[index].isAsc(true);
            return result;
        };
        GridViewModel.prototype.isValidOptions = function () {
            var vm = this;
            if (!lodash.isString(vm.entityName)) {
                return false;
            }
            if (!vm.templates)
                return false;
            if (!vm.callbacks)
                return false;
            if (!lodash.isFunction(vm.callbacks.onRemove) ||
                !lodash.isFunction(vm.callbacks.onUpdate) ||
                !lodash.isFunction(vm.callbacks.onAdd) ||
                !lodash.isFunction(vm.callbacks.getValues) ||
                !lodash.isFunction(vm.callbacks.getCountValues)) {
                return false;
            }
            if (!vm.filters) {
                return false;
            }
            if (!vm.headers || vm.headers.length === 0) {
                return false;
            }
            if (!vm.entityViewModel) {
                return false;
            }
            return true;
        };
        return GridViewModel;
    }());
    return GridViewModel;
});
//# sourceMappingURL=gridViewModel.js.map