import ko = require('knockout');
import lodash = require('lodash');
import gridViewmodel = require("../gridViewModel");
import settings = require("../../../common/settings");
import jquery = require('jquery');
import franchiseesService = require("../../../services/franchiseesService");
import users = require("../users/users");
import userViewModel = require("../users/userViewModel");
import vehicleViewModel = require("../vehicles/vehicleViewModel");
import saveModal = require("../../../common/modalTemplates/saveModal/saveModal");
import userService = require("../../../services/usersService");
import vehicles = require("../vehicles/vehicles");
import vehiclesService = require("../../../services/vehicleService");
import app = require("durandal/app");
import categoryViewModel = require('../products/categoryViewModel');

import productService = require("../../../services/productsService");


class TaxationViewModel {
    public isUsed: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;
    public value: KnockoutObservable<string>;

    constructor() {
        this.isUsed = ko.observable<boolean>();
        this.name = ko.observable<string>();
        this.value = ko.observable<string>().extend({ number: true });
    }
}

class FranchiseesSettings {

    public id: number;
    public isUpdateMode: boolean;
    public headerName: string;
    public tableUsersTemplate: any;
    public legalName: KnockoutObservable<string>;
    public abn: KnockoutObservable<string>;
    public tfn: KnockoutObservable<string>;
    public codeNumber: KnockoutObservable<string>;
    private taxations: KnockoutObservableArray<TaxationViewModel>;
    public users: KnockoutObservableArray<any>;
    public categories: KnockoutObservableArray<any>;
    public vehicles: KnockoutObservableArray<any>;
    private static VALIDATION_INCLUDED = ['legalName', 'abn', 'tfn', 'password', 'ownerFirstName', 'ownerSurname',
        'ownerEmailAddress', ' address', 'suburb', 'country', 'state', 'postCode', 'phoneNumber'];
    public selectedState: KnockoutObservable<any>;
    public allStates: KnockoutObservableArray<any>;
    ownerFirstName: KnockoutObservable<string>;
    ownerSurname: KnockoutObservable<string>;
    ownerEmailAddress: KnockoutObservable<string>;
    address: KnockoutObservable<string>;
    suburb: KnockoutObservable<string>;
    state: KnockoutObservable<string>;
    postCode: KnockoutObservable<string>;
    phoneNumber: KnockoutObservable<string>;
    country: KnockoutObservable<string>;
    userEntityName: string = 'Пользователь';
    vehicleEntityName: string = 'Транспорт';
    tableVehiclesTemplate: any;
    tableCategoriesTemplate: any;

    public isValidModel: KnockoutComputed<any>;

    constructor() {
        this.taxations = ko.observableArray<TaxationViewModel>();
        let taxation1 = new TaxationViewModel();
        let taxation2 = new TaxationViewModel();
        this.taxations.push(taxation1);
        this.taxations.push(taxation2);

        this.legalName = ko.observable<string>();
        this.abn = ko.observable<string>();
        this.tfn = ko.observable<string>();
        this.codeNumber = ko.observable<string>();
        this.selectedState = ko.observable<any>();
        this.allStates = ko.observableArray<any>();

        this.ownerFirstName = ko.observable<string>();
        this.ownerSurname = ko.observable<string>();
        this.address = ko.observable<string>();
        this.suburb = ko.observable<string>();
        this.state = ko.observable<string>();
        this.postCode = ko.observable<string>();
        this.country = ko.observable<string>();
        this.phoneNumber = ko.observable<string>();
        this.ownerEmailAddress = ko.observable<string>().extend({ mail: true });
        this.loadFranchiseeStatuses();
        this.tableUsersTemplate = {
            name: 'Операторы',
            headers: ['Код', 'Имя пользователя', 'Владелец', 'Управление'],
            contentTemplate: 'entities/templates/userFranchiseeTemplate',
            deleteByFranchisee: (this.deleteUserByFranchisee as any).bind(this)
        };

        this.tableVehiclesTemplate = {
            name: 'Транспорт',
            headers: ['Код', 'Номерной знак', 'Статус', 'Управление'],
            contentTemplate: 'entities/templates/vehicleFranchiseeTemplate',
            deleteByFranchisee: (this.deleteVehicleByFranchisee as any).bind(this)
        };



        this.tableCategoriesTemplate = {
            name: 'Категории',
            headers: ['Код', 'Имя','Управление'],
            contentTemplate: 'entities/templates/categoriesFranchiseeTemplate',
            deleteByFranchisee: (this.deleteCategoryByFranchisee as any).bind(this),
            updateCategory: (this.updateCategory as any).bind(this)
        };



        this.users = ko.observableArray<any>();
        this.categories = ko.observableArray<any>();
        this.vehicles = ko.observableArray<any>();
        this.allStates(settings.Settings.commonStatuses);

        this.isValidModel = ko.computed<any>(() => {
            var rowForValidation = _.pick(this, FranchiseesSettings.VALIDATION_INCLUDED);
            var value = !_.some(rowForValidation, (value) => {
                var property = ko.unwrap(value);
                var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                return lodash.isNil(property) || (property === "") || isValid || !this.isValidTaxtaions();
            });
            return value;
        });


    }


    public deleteCategoryByFranchisee(value: any) {
        productService.deleteCategory(value.id).then(() => {
            this.getCategoriesByFranchiseeId();
        });
    }


    private loadFranchiseeStatuses() {

    }

    private initialize(id: any) {
        this.getFranchisees(id).then(data => {
            this.initValues(data);
        });
    }

    private initValues(data) {
        this.codeNumber(data.codeNumber);
        this.users(data.users);
        this.categories(data.categories);
        this.mapVehicles(data.vehicles);
        this.vehicles(data.vehicles);
        this.id = data.id;
        this.legalName(data.legalName);
        this.abn(data.abn);
        this.tfn(data.tfn);
        this.selectedState(data.status);
        this.ownerFirstName(data.ownerFirstName);
        this.ownerSurname(data.ownerSurname);
        this.ownerEmailAddress(data.ownerEmailAddress);
        this.address(data.address);
        this.suburb(data.suburb);
        this.country(data.country);
        this.state(data.state);
        this.postCode(data.postCode);
        this.phoneNumber(data.phoneNumber);
        this.taxations()[0].isUsed(data.isUseTaxation1);
        this.taxations()[1].isUsed(data.isUseTaxation2);
        this.taxations()[0].name(data.taxationName1);
        this.taxations()[1].name(data.taxationName2);
        this.taxations()[0].value(data.taxation1);
        this.taxations()[1].value(data.taxation2);

    }

    public deleteUserByFranchisee(value: any) {
        userService.unassignUser(value.id).then(() => {
            this.getUsersByFranchiseeId();
        });
    }

    public deleteVehicleByFranchisee(value: any) {
        vehiclesService.unassignVehicle(value.id).then(() => {
            this.getVehiclesByFranchiseeId();
        });
    }

    private getFranchisees(id) {
        if (id) {
            return franchiseesService.loadFranchisee(id);
        }
        return $.Deferred().reject();
    }

    public addUser() {
        var viewModel = new userViewModel(true);
        viewModel.franchiseeID(this.id); // set current franchisee to Modal dialog.
        var dialog = new saveModal('Добавить новую сущность -' + this.userEntityName, viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                let unwrapped = ko.toJS(entity);
                new users().addUser(unwrapped).then(() => { // poor code
                    this.getUsersByFranchiseeId();
                });
            }
        });
    }

    public getUsersByFranchiseeId() {
        userService.load({ franchiseeId: this.id }).then((data) => {
            this.users(data.items);
        });
    }

    public getVehiclesByFranchiseeId() {
        vehiclesService.load({ franchiseeId: this.id }).then((data) => {
            this.mapVehicles(data.items);
            this.vehicles(data.items);
        });
    }

    private mapVehicles(vehicles: any) {
        _.forEach(vehicles, vehicle => {
            vehicle.status = lodash.find<any>(settings.Settings.commonStatuses, 'value', vehicle.status - 1);
        });
    }

    public addVehicle() {
        var viewModel = new vehicleViewModel(true);
        viewModel.franchiseeID(this.id); // set current franchisee to Modal dialog.

        var dialog = new saveModal('Добавить новую сущность - ' + this.userEntityName, viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                let unwrapped = ko.toJS(entity);
                new vehicles().addVehicle(unwrapped).then(() => { // poor code
                    this.getVehiclesByFranchiseeId();
                });
            }
        });
    }

    public addCategory(value: any) {

      

        var viewModel = new categoryViewModel(true);
        viewModel.franchiseeId(this.id); // set current franchisee to Modal dialog.

        var dialog = new saveModal('Добавить новую сущность - ' + 'категория', viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                let unwrapped = ko.toJS(entity);
                let mapped = {
                    code: unwrapped.code,
                    name: unwrapped.name,
                    franchiseeId: unwrapped.franchiseeId
                }

                productService.addCategory(mapped).then(() => {
                    this.getCategoriesByFranchiseeId();
                });
            }
        });


    }


    public updateCategory(value: any) {

        var viewModel = new categoryViewModel(true);
        viewModel.franchiseeId(this.id); // set current franchisee to Modal dialog.
        viewModel.setProperties(value);

        var dialog = new saveModal('Обновить сущность - ' + 'категория', viewModel);
        dialog.show().then((status, entity) => {
            if (status === 'save') {
                let unwrapped = ko.toJS(entity);
                let mapped = {
                    id: unwrapped.id,
                    code: unwrapped.code,
                    name: unwrapped.name,
                    franchiseeId: unwrapped.franchiseeId
                }

                productService.updateCategory(mapped).then(() => {
                    this.getCategoriesByFranchiseeId();
                });
            }
        });


    }


    


    public getCategoriesByFranchiseeId() {
        productService.getCategories(true,this.id).then((data) => {
            this.categories(data);
        });
    }

    public switchDetails() {
        let context = (this as any);
        context.detailsOpened(!context.detailsOpened());
    }

    public save() {
        let config = this.createConfig();
        if (this.isUpdateMode) {
            franchiseesService.updateFranchisee(this.id, config).then(() => {
                app.showMessage('Запись успешно обновлена!');
            });
        } else {
            franchiseesService.addFranchisee(config);
        }

    }

    private isValidTaxtaions() {
        let value = true;
        let properties = ['name', 'value'];
        _.forEach(this.taxations(), (taxation: any) => {
            var rowForValidation = _.pick(taxation, properties);
            if (taxation.isUsed() === true && value) {
                value = !_.some(rowForValidation, (value) => {
                    var property = ko.unwrap(value);
                    return lodash.isNil(property) || (property === "");
                });
            }
        });
        return value;
    }

    private createConfig() {
        return {
            codeNumber: this.codeNumber(),
            legalName: this.legalName(),
            abn: this.abn(),
            tfn: this.tfn(),
            status: this.selectedState().value,
            ownerFirstName: this.ownerFirstName(),
            ownerSurname: this.ownerSurname(),
            ownerEmailAddress: this.ownerEmailAddress(),
            address: this.address(),
            suburb: this.suburb(),
            country: this.country(),
            state: this.state(),
            postCode: this.postCode(),
            phoneNumber: this.phoneNumber(),
            isUseTaxation1: this.taxations()[0].isUsed(),
            isUseTaxation2: this.taxations()[1].isUsed(),
            taxationName1: this.taxations()[0].name(),
            taxationName2: this.taxations()[1].name(),
            taxation1: this.taxations()[0].value(),
            taxation2: this.taxations()[0].value()
        }
    }


    private removeFranchisee(user: any) {
        return franchiseesService.deleteFranchisee(user);
    }
    private activate(id: any) {
        this.isUpdateMode = (id) ? true : false;
        if (this.isUpdateMode) {
            this.headerName = 'Редактировать Франшизу';
        } else {
            this.headerName = 'Добавить Франшизу';
        }
        this.initialize(id);
    }



}

export = FranchiseesSettings;