import ko = require('knockout');
import usersService = require("../../../services/usersService");
import franchiseesService = require("../../../services/franchiseesService");
import lodash = require('lodash');
import productsService = require("../../../services/productsService");
import settings = require("../../../common/settings");

class CategoryViewModel {

    public id: KnockoutObservable<number> = ko.observable<number>();
    public code: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });
    public name: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25 });

    public categoryStatus = 'update';


    public franchiseeId: KnockoutObservable<number> = ko.observable<any>();


    private static VALIDATION_INCLUDED = ['code', 'name'];

    public addCategoryMode: boolean;

    constructor(addCategoryMode: boolean = false) {
        this.addCategoryMode = addCategoryMode;
    }

    private initialize() {

    }

    public setProperties(entity: any) {
        var vm = this;
        vm.id(entity.id);
        vm.code(entity.code);
        vm.name(entity.name);
        vm.franchiseeId(entity.franchiseeID);
    }

    private isValidModel() {
        var rowForValidation = _.pick(this, CategoryViewModel.VALIDATION_INCLUDED);
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

export = CategoryViewModel;