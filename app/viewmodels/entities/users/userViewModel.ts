import ko = require('knockout');
import usersService = require("../../../services/usersService");
import franchiseesService = require("../../../services/franchiseesService");
import lodash = require('lodash');

class UserViewModel {
    public id: KnockoutObservable<number> = ko.observable<number>();
    public firstName: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25});
    public lastName: KnockoutObservable<string> = ko.observable<string>().extend({ limitLength: 25});
    public emailAddress: KnockoutObservable<string> = ko.observable<string>().extend({ mail: true });
    public franchiseeName: KnockoutObservable<string> = ko.observable<string>();
    public linkedTo: KnockoutObservable<string> = ko.observable<string>();
    public password: KnockoutObservable<string> = ko.observable<string>().extend({ password: true });
    public hidden: KnockoutObservable<boolean> = ko.observable<boolean>();
    private franchisees: KnockoutObservableArray<any> = ko.observableArray<any>();
    public selectedFranchisee: KnockoutObservable<any> = ko.observable<any>();
    public franchiseeID: KnockoutObservable<number> = ko.observable<number>();
    private static VALIDATION_INCLUDED = ['firstName','lastName','emailAddress','password'];
    private userTypes: KnockoutObservableArray<any> = ko.observableArray<any>();
    private selectedUserType: KnockoutObservable<any> = ko.observable<any>();
    public userType: KnockoutObservable<number> = ko.observable<number>();
    public addFranchiseeMode: boolean;

    constructor(addFranchiseeMode: boolean = false) {
        this.addFranchiseeMode = addFranchiseeMode;
    }

    private initialize() {
        franchiseesService.load().then(data => {
            this.franchisees(data);
            this.setSelectedFranchisee();
        });
        usersService.loadUserTypes().then(data => {
            this.userTypes(data);
            this.setSelectedUserType();
        });
    }
    private setSelectedUserType() {
        var selected = lodash.find<any, any>(this.userTypes(), value => {
 
            return value.value === this.userType();
        });
        this.selectedUserType(selected);
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
        vm.userType(entity.userType);
        vm.password(entity.password);
        vm.firstName(entity.firstName);
        vm.lastName(entity.lastName);
        vm.emailAddress(entity.emailAddress);
        vm.franchiseeName(entity.franchiseeName);
        vm.linkedTo(entity.userType);
        vm.hidden(entity.hidden);
        vm.franchiseeID(entity.franchiseeID);
    }



    private isValidModel() {
        var rowForValidation = _.pick(this, UserViewModel.VALIDATION_INCLUDED);
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

export = UserViewModel;