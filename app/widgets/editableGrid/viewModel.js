define(["require", "exports", "knockout", "lodash", "../../common/settings", "../../common/modalTemplates/saveModal/saveModal", "pageViewModel", "../../common/errorHandler", "durandal/app", "../../common/csvDownloader"], function (require, exports, ko, lodash, settings, saveModal, ViewModel, errorHandler, app, csvHelper) {
    "use strict";
    var GridVM = (function () {
        function GridVM() {
            var _this = this;
            this.getFirstPage = function () {
                var page = _this.getPageByIndex(0);
                _this.changePage(page);
            };
            this.getLastPage = function () {
                var page = _this.getPageByIndex(_this.pagesCount() - 1);
                _this.changePage(page);
            };
            this.getPageByIndex = function (index) {
                var vm = _this;
                return lodash.find(vm.allPages(), { 'value': index });
            };
            this.changePage = function (activePage) {
                var vm = _this;
                _.forEach(vm.pages(), function (page) {
                    page.isActive(false);
                });
                _this.usePaging = true;
                _this.currentPage(activePage);
                _this.currentPageIndex(activePage.value);
                _this.getValues(_this.getParamtersForLoadValues(), activePage);
            };
            this.onRemove = function (value) {
                var vm = _this;
                app.showMessage('Вы уверены,что хотите удалить запись - ' + vm.currentEntity + '?', 'Удалить запись - ' + vm.currentEntity, ["Да", "Нет"])
                    .then(function (dialogResult) {
                    if (dialogResult === 'Да') {
                        vm.callbacks.onRemove(value).done(function () {
                            vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
                        }).fail(function (ex) {
                            errorHandler.onServiceError(ex);
                        });
                    }
                });
            };
            this.onSort = function (value) {
                var vm = _this;
                if (!value.fieldName) {
                    return;
                }
                if (value.isSort()) {
                    value.isAsc(!value.isAsc());
                }
                else {
                    _.forEach(vm.headers(), function (header) {
                        header.isSort(false);
                        header.isAsc(false);
                    });
                    value.isSort(true);
                    value.isAsc(true);
                }
                vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
            };
            this.onSearch = function (text) {
                var vm = _this;
                if (text) {
                    vm.usePaging = false;
                    vm.getValues(vm.getParamtersForLoadValues(), vm.currentPage());
                }
            };
            this.getNextPage = function () {
                var vm = _this;
                if (vm.hasNextPage()) {
                    var page = vm.getPageByIndex(vm.currentPageIndex() + 1);
                    vm.changePage(page);
                }
            };
            this.getPrevPage = function () {
                if (_this.hasPrevPage()) {
                    var page = _this.getPageByIndex(_this.currentPageIndex() - 1);
                    _this.changePage(page);
                }
            };
            this.hasPrevPage = function () {
                if (!_this.currentPageIndex()) {
                    return false;
                }
                return _this.currentPageIndex() > 0;
            };
            this.hasNextPage = function () {
                var vm = _this;
                return vm.currentPageIndex() + 1 < vm.pagesCount();
            };
            this.onConfig = function (entity) {
                return _this.callbacks.onConfig(entity);
            };
            this.onConfigIcon = function (entity) {
                _this.callbacks.onConfigIcon(entity).then(function () {
                    _this.getValues(_this.getParamtersForLoadValues(), _this.currentPage());
                });
            };
            this.showField = function (field, fieldName) {
                _this.callbacks.onShowField(field, fieldName);
            };
            this.getIcon = function (entity) {
                return _this.callbacks.getIcon(entity);
            };
            this.updateCheckbox = function (value) {
                _this.callbacks.onUpdate(value).done(function () {
                    _this.getValues(_this.getParamtersForLoadValues(), _this.currentPage());
                });
            };
            this.updateCheckboxList = function (active) {
                _this.callbacks.updateCheckboxList(active).done(function () {
                    _this.getValues(_this.getParamtersForLoadValues(), _this.currentPage());
                });
            };
            this.onUpdate = function (value) {
                var viewModel = new _this.entityViewModel(false);
                viewModel.setProperties(value);
                var dialog = new saveModal('Обновить запись - ' + _this.currentEntity, viewModel);
                dialog.show().then(function (status, entity) {
                    if (status === 'save') {
                        var resultEntity = ko.toJS(entity);
                        resultEntity.id = value.id;
                        _this.callbacks.onUpdate(resultEntity).done(function () {
                            _this.getValues(_this.getParamtersForLoadValues(), _this.currentPage);
                        }).fail(function (ex) {
                            errorHandler.onServiceError(ex);
                        });
                    }
                });
            };
            this.activate = function (activationData) {
                if (!activationData.options) {
                    return;
                }
                if (activationData.options.templates.preHeaderTemplate) {
                    _this.preHeaderTemplate = activationData.options.templates.preHeaderTemplate;
                }
                if (activationData.options.templates.preHeaderModel) {
                    _this.preHeaderModel = activationData.options.templates.preHeaderModel;
                }
                if (activationData.options.initiateUpdate) {
                    _this.initiateUpdate = activationData.options.initiateUpdate;
                }
                _this.initializeFilterSubscribes();
                _this.template(activationData.options.templates.rowTemplate);
                _this.headerTemplate(activationData.options.templates.headerTemplate);
                _this.filtersTemplate = activationData.options.templates.filtersTemplate || [];
                _this.headers(activationData.options.headers);
                _this.callbacks = activationData.options.callbacks;
                _this.entityViewModel = activationData.options.entityViewModel;
                _this.currentEntity = activationData.options.entityName;
                _this.modalMessages = activationData.options.modalMessages || {};
                var filters = activationData.options.filters || [];
                lodash.forEach(filters, function (filter) {
                    filter.entities.sort(function (left, right) {
                        return left.title > right.title ? 1 : -1;
                    });
                });
                _this.filters(filters);
                _this.initializeSubscribes();
                var parametersForLoadValues = _this.getParamtersForLoadValues();
                _this.getValues(parametersForLoadValues, _this.currentPage());
            };
            this.isNill = function (object) { return lodash.isNull(object); };
            this.preHeaderModel = {
                onAdd: this.onAdd.bind(this)
            };
            this.currentPage = ko.observable();
            this.currentEntity = '';
            this.totalItemsCount = ko.observable();
            this.modalMessages = new Array();
            this.filters = ko.observableArray();
            this.selectedCountItems = ko.observable(settings.Settings.defaultCountItems);
            this.headers = ko.observableArray();
            this.headerTemplate = ko.observable();
            this.template = ko.observable();
            this.currentPageIndex = ko.observable(0);
            this.filtersTemplate = ko.observable();
            this.pageSlide = ko.observable(settings.Settings.defaultPageSlide);
            this.pagesCount = ko.computed(function () {
                return Math.ceil(_this.totalItemsCount() / _this.selectedCountItems()) || 1;
            });
            this.searchText = ko.observable();
            this.pages = ko.observableArray();
            this.usePaging = true;
            this.allPages = ko.pureComputed(function () {
                var pages = [];
                var pagesCount = Math.ceil(_this.totalItemsCount() / _this.selectedCountItems()) || 1;
                for (var i = 0; i < pagesCount; i++) {
                    pages.push(new ViewModel.PageViewModel(i));
                }
                return pages;
            });
            this.values = ko.observableArray();
            this.countItems = settings.Settings.countItems;
        }
        GridVM.prototype.initializeSubscribes = function () {
            var _this = this;
            this.selectedCountItems.subscribe(function (item) {
                if (item && _this.totalItemsCount()) {
                    _this.currentPageIndex(0);
                    var parametersForLoadValues = _this.getParamtersForLoadValues();
                    _this.getValues(parametersForLoadValues, _this.currentPage());
                }
            });
            if (!lodash.isNil(this.initiateUpdate)) {
                this.initiateUpdate.subscribe(function (value) {
                    if (value === true) {
                        _this.initiateUpdate(false);
                        _this.currentPageIndex(0);
                        var parametersForLoadValues = _this.getParamtersForLoadValues();
                        _this.getValues(parametersForLoadValues, _this.currentPage());
                    }
                });
            }
        };
        GridVM.prototype.initializeFilterSubscribes = function () {
            var _this = this;
            this.filters.subscribe(function (items) {
                lodash.forEach(items, function (filter) {
                    filter.selectedValue.subscribe(function (value) {
                        _this.currentPageIndex(0);
                        var parametersForLoadValues = _this.getParamtersForLoadValues();
                        _this.getValues(parametersForLoadValues, _this.currentPage());
                    });
                });
            });
        };
        GridVM.prototype.getValues = function (filter, activePage) {
            var _this = this;
            this.callbacks.getValues(filter).done(function (response) {
                _this.values.removeAll();
                if (!lodash.isEmpty(response.items)) {
                    _this.values(response.items);
                    _this.totalItemsCount(response.count);
                    _this.updatePages(activePage);
                }
                else {
                    _this.totalItemsCount(0);
                    _this.updatePages();
                }
            });
        };
        GridVM.prototype.updatePages = function (currentPage) {
            if (currentPage === void 0) { currentPage = undefined; }
            var pages = [];
            if (this.pagesCount()) {
                var pageFrom = Math.max(0, this.currentPageIndex() - this.pageSlide());
                var pageTo = Math.min(this.pagesCount(), this.currentPageIndex() + this.pageSlide());
                pageFrom = Math.max(0, Math.min(pageTo - 2 * this.pageSlide(), pageFrom));
                pageTo = Math.min(this.pagesCount(), Math.max(pageFrom + 2 * this.pageSlide(), pageTo));
                for (var i = pageFrom; i < pageTo; i++) {
                    var page = new ViewModel.PageViewModel(i);
                    if (currentPage && page.name === currentPage.name) {
                        page.isActive(true);
                    }
                    if (!currentPage && page.name === 1) {
                        page.isActive(true);
                    }
                    pages.push(page);
                }
            }
            this.pages(pages);
        };
        GridVM.prototype.onAdd = function () {
            var _this = this;
            var viewModel = new this.entityViewModel(false);
            var dialog = new saveModal('Добавить новую запись -  ' + this.currentEntity, viewModel);
            dialog.show().then(function (status, entity) {
                if (status === 'save') {
                    _this.callbacks.onAdd(ko.toJS(entity)).then(function () {
                        _this.getValues(_this.getParamtersForLoadValues(), _this.currentPage());
                    });
                }
            });
        };
        GridVM.prototype.getParamtersForLoadValues = function () {
            var vm = this;
            var sortedHeader = lodash.filter(vm.headers(), function (header) {
                return header.isSort() === true;
            });
            var requestData = {
                searchContent: this.searchText(),
                from: this.usePaging ? vm.currentPageIndex() * vm.selectedCountItems() : 0,
                count: vm.selectedCountItems(),
            };
            var filtered = lodash.filter(vm.filters(), function (filter) {
                return filter.selectedValue();
            });
            var filters = lodash.map(filtered, function (value) {
                var testObj = {};
                testObj[value.selectedValue().fieldName] = value.selectedValue().id;
                return testObj;
            });
            _.forEach(filters, function (filter) {
                requestData = lodash.assign(filter, requestData);
            });
            if (sortedHeader.length !== 0) {
                requestData.sortBy = sortedHeader[0].fieldName;
                requestData.IsAscending = sortedHeader[0].isAsc();
            }
            return requestData;
        };
        GridVM.prototype.downloadCSV = function () {
            if (this.values()) {
                csvHelper.downloadCsv(this.values());
            }
        };
        return GridVM;
    }());
    return GridVM;
});
//# sourceMappingURL=viewModel.js.map