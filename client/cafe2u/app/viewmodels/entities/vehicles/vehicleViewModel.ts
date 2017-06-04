import ko = require('knockout');
import usersService = require("../../../services/usersService");
import franchiseesService = require("../../../services/franchiseesService");
import lodash = require('lodash');
import settings = require("../../../common/settings");

class VehicleViewModel {
    public id: KnockoutObservable<number> = ko.observable<number>();
    public vehicleCode: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });
    public licensePlate: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });
    public assigned: KnockoutObservable<string> = ko.observable<string>();
    public franchiseeName: KnockoutObservable<string> = ko.observable<string>();
    public status: KnockoutObservable<any>  = ko.observable<any>();

    public selectedStatus: KnockoutObservable<any> = ko.observable<any>();
    public allStatuses: KnockoutObservableArray<any> = ko.observableArray<any>(settings.Settings.commonStatuses);
    

    private franchisees: KnockoutObservableArray<any> = ko.observableArray<any>();
    public selectedFranchisee: KnockoutObservable<any> = ko.observable<any>();
    public franchiseeID: KnockoutObservable<number> = ko.observable<number>();
    private static VALIDATION_INCLUDED = ['vehicleCode', 'licensePlate'];

    public addFranchiseeMode: boolean;

    constructor(addFranchiseeMode: boolean = false) {
        this.addFranchiseeMode = addFranchiseeMode;

    }

    private initialize() {
        franchiseesService.load().then(data => {
            this.franchisees(data);
            this.setSelectedFranchisee();
        });
    }
    private setSelectedFranchisee() {
        var selected = lodash.find<any, any>(this.franchisees(), value => {
            return value.id === this.franchiseeID();
        });
        this.selectedFranchisee(selected);
    }
   

    private setProperties(entity: any) {
        var vm = this;
        vm.id(entity.id);
        vm.status(entity.status);
        vm.vehicleCode(entity.vehicleCode);
        vm.licensePlate(entity.licensePlate);
        vm.assigned(entity.emailAddress);
        vm.franchiseeName(entity.franchiseeName);
        vm.franchiseeID(entity.franchiseeID);
    }

    private isValidModel() {
        var rowForValidation = _.pick(this, VehicleViewModel.VALIDATION_INCLUDED);
        var value = !_.some(rowForValidation, (value) => {
            var property = ko.unwrap(value);
            var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
            return lodash.isNil(property) || (property === "") || isValid;
        });
        return value;
    }

    public activate() {
        this.initialize();
    }

}

export = VehicleViewModel;