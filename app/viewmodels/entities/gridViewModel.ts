import settings = require("../../common/settings");
import lodash = require('lodash');
import ko = require('knockout');

 class GridViewModel {
    constructor(public entityName: string, public templates: any, public filters: Array<any>,public headers: Array<any>,
        public callbacks: any, public entityViewModel: any, public initiateUpdate: any) {
        this.entityName = entityName;
        this.callbacks = callbacks;
        this.filters = filters;
        this.entityViewModel = entityViewModel;
        this.initiateUpdate = initiateUpdate;
        this.templates = this.fillTemplates(templates);
        this.headers = this.updateHeaders(headers);

    }

    private fillTemplates(templates: any) {
        if (templates) {
            templates.headerTemplate = templates.headerTemplate || settings.Settings.defaultHeaderTemplate;
            templates.filtersTemplate = templates.filtersTemplate || settings.Settings.defaultFiltersTemplate;
            templates.preHeaderTemplate = templates.preHeaderTemplate || settings.Settings.defaultPreHeaderTemplate;
        }
        return templates;
    }

    private updateHeaders(headers: Array<any>) {
        let result = lodash.map<any, any>(headers, header => {
            header.isAsc = ko.observable(false);
            header.isSort = ko.observable(false);
            return header;
        });
        let index = 0;
        result[index].isSort(true);
        result[index].isAsc(true);
        return result;
    }

    private isValidOptions() {
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
    }
}

export = GridViewModel;