define(["require", "exports", "knockout", "lodash", "../gridViewModel", "../../../viewModels/entities/vehicles/vehicleViewModel", "../../../common/settings", "../../../services/vehicleService"], function (require, exports, ko, lodash, gridViewmodel, vehicleViewModel, settings, vehiclesService) {
    "use strict";
    var Vehicles = (function () {
        function Vehicles() {
            var template = "entities/vehicles/vehicleTemplate";
            var headerTemplate = settings.Settings.defaultHeaderTemplate;
            var filtersTemplate = settings.Settings.defaultFiltersTemplate;
            var templates = {
                rowTemplate: template,
                headerTemplate: headerTemplate,
                filtersTemplate: filtersTemplate
            };
            var entityName = 'транспорт';
            var headers = [
                { title: 'Код', fieldName: 'id', className: 'col-md-1' },
                { title: 'Код транспорта', fieldName: 'vehicleCode', className: 'col-md-2' },
                { title: 'Номерной знак', fieldName: 'licensePlate', className: 'col-md-2' },
                { title: 'Франшиза', fieldName: 'franchiseeName', className: 'col-md-2' },
                { title: 'Статус', fieldName: 'status', className: 'col-md-2' },
                { title: 'Привязан', fieldName: 'assigned', className: 'col-md-1' }
            ];
            this.vehicles = ko.observableArray();
            this.vehicles([
                { fieldName: '', title: '', id: 1 },
                { fieldName: '', title: '', id: 0 }
            ]);
            var selectedFilterTitle = 'title';
            var selectedFilter = ko.observable();
            var callbacks = {
                getValues: this.getVehicles,
                onRemove: this.removeVehicle,
                onUpdate: this.updateVehicle.bind(this),
                onAdd: this.addVehicle.bind(this)
            };
            this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, vehicleViewModel, null);
        }
        Vehicles.prototype.getVehicles = function (filter) {
            var deffered = $.Deferred();
            vehiclesService.load(filter).then(function (data) {
                lodash.forEach(data.items, function (value) {
                    value.status = lodash.find(settings.Settings.commonStatuses, 'value', value.status - 1);
                });
                deffered.resolve(data);
            });
            return deffered.promise();
        };
        Vehicles.prototype.updateVehicle = function (vehicle) {
            var mappedEntity = this.mapToEntity(vehicle);
            return vehiclesService.updateVehicle(vehicle.id, mappedEntity);
        };
        Vehicles.prototype.mapToEntity = function (vehicle) {
            var franchiseeId = lodash.isNil(vehicle.selectedFranchisee) ? null : vehicle.selectedFranchisee.id;
            return {
                vehicleCode: vehicle.vehicleCode,
                licensePlate: vehicle.licensePlate,
                assigned: vehicle.assigned,
                status: vehicle.status.value,
                franchiseeID: franchiseeId
            };
        };
        Vehicles.prototype.addVehicle = function (vehicle) {
            var mappedEntity = this.mapToEntity(vehicle);
            return vehiclesService.addVehicle(mappedEntity);
        };
        Vehicles.prototype.removeVehicle = function (vehicle) {
            return vehiclesService.deleteVehicle(vehicle.id);
        };
        return Vehicles;
    }());
    return Vehicles;
});
//# sourceMappingURL=vehicles.js.map