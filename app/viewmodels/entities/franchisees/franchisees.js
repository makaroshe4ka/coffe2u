define(["require", "exports", "knockout", "lodash", "../gridViewModel", "../../../common/settings", "../../../services/franchiseesService", "../../../common/linkBuilder"], function (require, exports, ko, lodash, gridViewmodel, settings, franchiseesService, linkBuilder) {
    "use strict";
    var Franchisees = (function () {
        function Franchisees() {
            var template = "entities/franchisees/franchiseesTemplate";
            var headerTemplate = settings.Settings.defaultHeaderTemplate;
            var filtersTemplate = settings.Settings.defaultFiltersTemplate;
            var frahchisePreHeaderTemplate = 'entities/franchisees/franchiseePreHeaderTemplate';
            this.addFranchiseeLink = linkBuilder.hash(['franchisees']);
            var templates = {
                rowTemplate: template,
                headerTemplate: headerTemplate,
                filtersTemplate: filtersTemplate,
                preHeaderTemplate: frahchisePreHeaderTemplate
            };
            var entityName = 'франшиза';
            var headers = [
                { title: 'Код', fieldName: 'id', className: 'col-md-1' },
                { title: 'Название франшизы', fieldName: 'legalName', className: 'col-md-3' },
                { title: 'Номер франшизы', fieldName: 'codeNumber', className: 'col-md-2' },
                { title: 'Статус', fieldName: 'status', className: 'col-md-2' }
            ];
            this.franchisees = ko.observableArray();
            this.franchisees([]);
            var selectedFilterTitle = 'title';
            var selectedFilter = ko.observable();
            this.tableUsersTemplate = {
                name: 'Операторы',
                headers: ['Код', 'Имя пользователя', 'Права пользователя'],
                contentTemplate: 'entities/templates/usersTemplate'
            };
            this.tableVehiclesTemplate = {
                name: 'Транспорт',
                headers: ['Код', 'Номерной знак', 'Статус'],
                contentTemplate: 'entities/templates/vehiclesTemplate'
            };
            this.tableCategoriesTemplate = {
                name: 'Категории',
                headers: ['Код', 'Имя'],
                contentTemplate: 'entities/templates/categoriesTemplate'
            };
            var callbacks = {
                getValues: this.getFranchisees.bind(this),
                onRemove: this.removeFranchisee
            };
            this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, null, null);
        }
        Franchisees.prototype.getFranchisees = function (filter) {
            var deffered = $.Deferred();
            var global = this;
            franchiseesService.loadAllFranchisees(filter).then(function (data) {
                _.forEach(data.items, function (value) {
                    value.configureLink = linkBuilder.hash([{ 'franchisees': value.id }]);
                    value.detailsOpened = ko.observable(false);
                    value.switchDetail = global.switchDetails;
                    value.status = lodash.find(settings.Settings.commonStatuses, 'value', value.status - 1);
                    _.forEach(value.vehicles, function (vehicle) {
                        vehicle.status = lodash.find(settings.Settings.commonStatuses, 'value', vehicle.status - 1);
                    });
                });
                deffered.resolve(data);
            });
            return deffered.promise();
        };
        Franchisees.prototype.addFranchisee = function () {
            linkBuilder.navigate([{ 'addfranchisee': '' }]);
        };
        Franchisees.prototype.switchDetails = function () {
            var context = this;
            context.detailsOpened(!context.detailsOpened());
        };
        Franchisees.prototype.removeFranchisee = function (data) {
            return franchiseesService.deleteFranchisee(data.id);
        };
        return Franchisees;
    }());
    return Franchisees;
});
//# sourceMappingURL=franchisees.js.map