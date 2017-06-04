import ko = require('knockout');
import usersService = require("../../../services/usersService");
import franchiseesService = require("../../../services/franchiseesService");
import lodash = require('lodash');
import productsService = require("../../../services/productsService");
import settings = require("../../../common/settings");

class ProductViewModel {

    public id: KnockoutObservable<number> = ko.observable<number>();
    public code: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });
    public name: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });
    public price1: KnockoutObservable<number> = ko.observable<number>().extend({ currency: true });
    public price2: KnockoutObservable<number> = ko.observable<number>().extend({ currency: true });
    public createdBy: KnockoutObservable<string> = ko.observable<string>();
    public selectedState: KnockoutObservable<any> = ko.observable<any>();
    public allStates: KnockoutObservableArray<any> = ko.observableArray<any>();

    public franchiseeId: KnockoutObservable<number> = ko.observable<any>();

  
    private static VALIDATION_INCLUDED = ['code', 'name', 'price1', 'price2'];

    public addProductMode: boolean;

    constructor(addProductMode: boolean = false) {
        this.addProductMode = addProductMode;
        this.allStates(settings.Settings.commonStatuses);
    }

    private initialize() {
        
    }

    private setProperties(entity: any) {
        var vm = this;
        vm.id(entity.id);
        vm.code(entity.code);
        vm.name(entity.name);
        vm.price1(entity.price1);
        vm.price2(entity.price2);
        vm.createdBy(entity.createdBy);
        vm.selectedState(entity.status);
        vm.franchiseeId(entity.franchiseeID);
    }

    private isValidModel() {
        var rowForValidation = _.pick(this, ProductViewModel.VALIDATION_INCLUDED);
        var value = !_.some(rowForValidation, (value) => {
            var property = ko.unwrap(value);
            var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
            return lodash.isNil(property) || (property === "") || isValid;
        });

        if (this.price1() > this.price2()) {
            return false;}

        return value;
    }

    public activate() {
        this.initialize();
    }

}

export = ProductViewModel;