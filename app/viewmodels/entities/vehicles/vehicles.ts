import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import vehicleViewModel = require("../../../viewModels/entities/vehicles/vehicleViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import vehiclesService = require("../../../services/vehicleService");


class Vehicles {

    public gridConfig: any;
    public vehicles: KnockoutObservableArray<any>;
    public selectedUser: KnockoutObservable<any>;
    public status: any;
    constructor() {
        let template: string = "entities/vehicles/vehicleTemplate";
        let headerTemplate: string = settings.Settings.defaultHeaderTemplate;
        let filtersTemplate: string = settings.Settings.defaultFiltersTemplate;


        let templates: any = {
            rowTemplate: template,
            headerTemplate: headerTemplate,
            filtersTemplate: filtersTemplate
        }
        let entityName: string = 'транспорт';
        let headers: Array<any> = [
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
        let selectedFilterTitle = 'title';
        let selectedFilter = ko.observable();


        

        let callbacks = {
            getValues: this.getVehicles,
            onRemove: this.removeVehicle,
            onUpdate: (this.updateVehicle as any).bind(this),
            onAdd: (this.addVehicle as any).bind(this)
        }

        this.gridConfig = new gridViewmodel(entityName, templates, null, headers, callbacks, vehicleViewModel, null);
    }

    private getVehicles(filter) {

        let deffered = $.Deferred();

        vehiclesService.load(filter).then((data) => {
            lodash.forEach<any>(data.items, value => {
                value.status = lodash.find<any>(settings.Settings.commonStatuses, 'value', value.status - 1);
            });
            deffered.resolve(data);
        });

        return deffered.promise();
    }
    public updateVehicle(vehicle: any) {
        let mappedEntity = this.mapToEntity(vehicle);
        return vehiclesService.updateVehicle(vehicle.id, mappedEntity);
    }
    public mapToEntity(vehicle: any) {
        let franchiseeId = lodash.isNil(vehicle.selectedFranchisee) ? null : vehicle.selectedFranchisee.id;
        return {
            vehicleCode: vehicle.vehicleCode,
            licensePlate: vehicle.licensePlate,
            assigned: vehicle.assigned,
            status: vehicle.status.value,
            franchiseeID: franchiseeId
        }
    }
    public addVehicle(vehicle: any) {
        let mappedEntity = this.mapToEntity(vehicle);
        return vehiclesService.addVehicle(mappedEntity);
    }
    private removeVehicle(vehicle: any) {
        return vehiclesService.deleteVehicle(vehicle.id);
    }
}

export = Vehicles;