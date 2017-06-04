define(["require", "exports", "knockout", "lodash", "../gridViewModel", "../../../common/settings", "../../../services/productsService", "../products/productViewModel", "durandal/app", "../../../common/errorHandler"], function (require, exports, ko, lodash, gridViewmodel, settings, productsService, ViewModel, app, errorHandler) {
    "use strict";
    var Products = (function () {
        function Products() {
            var _this = this;
            this.selectedOption = ko.observable();
            this.currentCategory = ko.observable();
            this.currentGroup = ko.observable();
            this.categories = ko.observableArray();
            this.groups = ko.observableArray();
            this.getcategories();
            this.codeGroupHeader = ko.observable();
            this.nameGroupHeader = ko.observable();
            this.raiseUpdate = ko.observable(false);
            this.groupFranchisee = ko.observableArray();
            this.groupName = ko.observable();
            var template = "entities/products/productsTemplate";
            var headerTemplate = settings.Settings.defaultHeaderTemplate;
            var filtersTemplate = settings.Settings.defaultFiltersTemplate;
            this.currentGroup.subscribe(function (group) {
                _this.codeGroupHeader('КОД');
                _this.nameGroupHeader('НАЗВАНИЕ');
            });
            var templates = {
                rowTemplate: template,
                headerTemplate: headerTemplate,
                filtersTemplate: filtersTemplate
            };
            var entityName = 'товар';
            var headers = [
                { title: this.codeGroupHeader, fieldName: 'code', className: 'col-md-1' },
                { title: this.nameGroupHeader, fieldName: 'name', className: 'col-md-2' },
                { title: 'Цена 1', fieldName: 'price1', className: 'col-md-1' },
                { title: 'Цена 2', fieldName: 'price2', className: 'col-md-1' },
                { title: 'Прибыль', fieldName: 'money', className: 'col-md-1' },
                { title: 'Статус', fieldName: 'status', className: 'col-md-2' },
                { title: 'Сделано', fieldName: 'createdBy', className: 'col-md-2' }
            ];
            var selectedFilterTitle = 'title';
            var selectedFilter = ko.observable();
            var callbacks = {
                getValues: this.getItems.bind(this),
                onRemove: this.removeItem,
                onUpdate: this.updateItem.bind(this),
                onAdd: this.addItem.bind(this)
            };
            this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, ViewModel, this.raiseUpdate);
            productsService.getCategories(true, null).then(function (categories) {
                var groupedByFranchisee = lodash.groupBy(categories, function (x) {
                    return x.franchiseeID;
                });
                _.forEach(groupedByFranchisee, function (value) {
                    value.franchiseeName =
                        _.first(value).franchiseeName;
                });
                _this.groupFranchisee(_.values(groupedByFranchisee));
            });
            this.currentSelectedFranchisee = ko.computed(function () {
                var startWith = "Текущая франшиза: ";
                if (_this.selectedOption()) {
                    return startWith + _this.selectedOption().franchiseeName;
                }
                if (_this.currentCategory()) {
                    return startWith + _this.currentCategory().franchiseeName;
                }
                return startWith + "не выбрана";
            });
        }
        Products.prototype.getItems = function (filter) {
            var deffered = $.Deferred();
            if (_.isNil(this.additionFilter)) {
                return deffered.promise();
            }
            productsService.getItems(_.assign({}, this.additionFilter, filter)).then(function (data) {
                _.forEach(data.items, function (value) {
                    value.money = ko.computed(function () {
                        return (value.price2 - value.price1) + "$";
                    });
                    value.status = lodash.find(settings.Settings.commonStatuses, 'value', value.status - 1);
                });
                deffered.resolve(data);
            });
            return deffered.promise();
        };
        Products.prototype.getExtendedFilter = function () {
            var filter;
            filter = {};
            filter.franchiseeId = this.currentCategory().franchiseeID;
            filter.categoryId = this.currentCategory().id;
            filter.groupId = this.currentGroup().id;
            return filter;
        };
        Products.prototype.removeItem = function (entity) {
            var deffered = $.Deferred();
            productsService.deleteProduct(entity.id).then(function () {
                deffered.resolve();
            });
            return deffered.promise();
        };
        Products.prototype.updateItem = function (entity) {
            var deffered = $.Deferred();
            var mapped = this.mapItemToEntity(entity);
            productsService.updateProduct(entity.id, mapped).then(function (result) {
                deffered.resolve(result);
            });
            return deffered.promise();
        };
        Products.prototype.addItem = function (entity) {
            var deffered = $.Deferred();
            var mapped = this.mapItemToEntity(entity);
            mapped.groupId = this.currentGroup().id;
            mapped.franchiseeId = this.currentCategory().franchiseeID;
            productsService.addProduct(mapped).then(function (result) {
                deffered.resolve(result);
            });
            return deffered.promise();
        };
        Products.prototype.getcategories = function () {
            var _this = this;
            productsService.getCategories(false, null).then(function (categories) {
                _this.extendToViewModel(categories);
                _this.categories(categories);
                _this.setDefaultState(_this.categories);
                _this.currentCategory(lodash.first(_this.categories()));
                _this.getGroups(_this.currentCategory().id).then(function () { _this.updateGrid(_this.getExtendedFilter()); });
            });
        };
        Products.prototype.changeFrahcnhisee = function (value) {
            var _this = this;
            this.getGroups(this.selectedOption().id).then(function () {
                var customFilter = {
                    franchiseeId: value.franchiseeID,
                    categoryId: value.id,
                    groupId: _this.currentGroup().id
                };
                _this.updateGrid(customFilter);
            });
        };
        Products.prototype.addGroup = function () {
            var _this = this;
            if (_.isEmpty(this.groupName())) {
                return;
            }
            var config = {
                name: this.groupName(),
                categoryId: this.selectedOption().id
            };
            productsService.addGroup(config).then(function () {
                _this.getGroups(_this.selectedOption().id);
            });
        };
        Products.prototype.deleteGroup = function (group) {
            var _this = this;
            app.showMessage('Вы уверены,что хотите удалить данную группу? ', 'Удаление', ["Да", "Нет"])
                .then(function (dialogResult) {
                if (dialogResult === 'Да') {
                    productsService.deleteGroup(group.id).then(function () {
                        _this.getGroups(_this.selectedOption().id);
                    }).fail(function (ex) {
                        errorHandler.onServiceError(ex);
                    });
                }
            });
        };
        Products.prototype.getGroups = function (categoryId) {
            var _this = this;
            return productsService.getGroups(categoryId).then(function (groups) {
                _this.extendToViewModel(groups);
                _this.groups(groups);
                var first = _this.setDefaultState(_this.groups);
                _this.currentGroup(first);
            });
        };
        Products.prototype.setDefaultState = function (data) {
            var first = lodash.first(data());
            if (!_.isNil(first)) {
                first.active(true);
            }
            return first;
        };
        Products.prototype.extendToViewModel = function (data) {
            lodash.forEach(data, function (val) {
                val.active = ko.observable(false);
            });
        };
        Products.prototype.activate = function () {
        };
        Products.prototype.selectTab = function (category) {
            var _this = this;
            this.resetValues(this.categories);
            category.active(true);
            this.currentCategory(category);
            this.getGroups(this.currentCategory().id).then(function () { _this.updateGrid(_this.getExtendedFilter()); });
        };
        Products.prototype.selectGroup = function (group) {
            this.resetValues(this.groups);
            group.active(true);
            this.currentGroup(group);
            this.updateGrid(this.getExtendedFilter());
        };
        Products.prototype.resetValues = function (data) {
            _.each(data(), function (item) {
                item.active(false);
            });
        };
        Products.prototype.updateGrid = function (filter) {
            if (_.isNil(filter)) {
                return;
            }
            this.additionFilter = this.getExtendedFilter();
            this.raiseUpdate(true);
        };
        Products.prototype.mapItemToEntity = function (item) {
            return {
                id: item.id,
                code: item.code,
                name: item.name,
                price1: item.price1,
                price2: item.price2,
                createdBy: item.createdBy,
                status: item.selectedState.value
            };
        };
        return Products;
    }());
    return Products;
});
//# sourceMappingURL=products.js.map