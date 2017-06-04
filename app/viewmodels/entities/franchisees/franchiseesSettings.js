define(["require", "exports", "knockout", "lodash", "../../../common/settings", "../../../services/franchiseesService", "../users/users", "../users/userViewModel", "../vehicles/vehicleViewModel", "../../../common/modalTemplates/saveModal/saveModal", "../../../services/usersService", "../vehicles/vehicles", "../../../services/vehicleService", "durandal/app", "../products/categoryViewModel", "../../../services/productsService"], function (require, exports, ko, lodash, settings, franchiseesService, users, userViewModel, vehicleViewModel, saveModal, userService, vehicles, vehiclesService, app, categoryViewModel, productService) {
    "use strict";
    var TaxationViewModel = (function () {
        function TaxationViewModel() {
            this.isUsed = ko.observable();
            this.name = ko.observable();
            this.value = ko.observable().extend({ number: true });
        }
        return TaxationViewModel;
    }());
    var FranchiseesSettings = (function () {
        function FranchiseesSettings() {
            var _this = this;
            this.userEntityName = 'Пользователь';
            this.vehicleEntityName = 'Транспорт';
            this.taxations = ko.observableArray();
            var taxation1 = new TaxationViewModel();
            var taxation2 = new TaxationViewModel();
            this.taxations.push(taxation1);
            this.taxations.push(taxation2);
            this.legalName = ko.observable();
            this.abn = ko.observable();
            this.tfn = ko.observable();
            this.codeNumber = ko.observable();
            this.selectedState = ko.observable();
            this.allStates = ko.observableArray();
            this.ownerFirstName = ko.observable();
            this.ownerSurname = ko.observable();
            this.address = ko.observable();
            this.suburb = ko.observable();
            this.state = ko.observable();
            this.postCode = ko.observable();
            this.country = ko.observable();
            this.phoneNumber = ko.observable();
            this.ownerEmailAddress = ko.observable().extend({ mail: true });
            this.loadFranchiseeStatuses();
            this.tableUsersTemplate = {
                name: 'Операторы',
                headers: ['Код', 'Имя пользователя', 'Владелец', 'Управление'],
                contentTemplate: 'entities/templates/userFranchiseeTemplate',
                deleteByFranchisee: this.deleteUserByFranchisee.bind(this)
            };
            this.tableVehiclesTemplate = {
                name: 'Транспорт',
                headers: ['Код', 'Номерной знак', 'Статус', 'Управление'],
                contentTemplate: 'entities/templates/vehicleFranchiseeTemplate',
                deleteByFranchisee: this.deleteVehicleByFranchisee.bind(this)
            };
            this.tableCategoriesTemplate = {
                name: 'Категории',
                headers: ['Код', 'Имя', 'Управление'],
                contentTemplate: 'entities/templates/categoriesFranchiseeTemplate',
                deleteByFranchisee: this.deleteCategoryByFranchisee.bind(this),
                updateCategory: this.updateCategory.bind(this)
            };
            this.users = ko.observableArray();
            this.categories = ko.observableArray();
            this.vehicles = ko.observableArray();
            this.allStates(settings.Settings.commonStatuses);
            this.isValidModel = ko.computed(function () {
                var rowForValidation = _.pick(_this, FranchiseesSettings.VALIDATION_INCLUDED);
                var value = !_.some(rowForValidation, function (value) {
                    var property = ko.unwrap(value);
                    var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                    return lodash.isNil(property) || (property === "") || isValid || !_this.isValidTaxtaions();
                });
                return value;
            });
        }
        FranchiseesSettings.prototype.deleteCategoryByFranchisee = function (value) {
            var _this = this;
            productService.deleteCategory(value.id).then(function () {
                _this.getCategoriesByFranchiseeId();
            });
        };
        FranchiseesSettings.prototype.loadFranchiseeStatuses = function () {
        };
        FranchiseesSettings.prototype.initialize = function (id) {
            var _this = this;
            this.getFranchisees(id).then(function (data) {
                _this.initValues(data);
            });
        };
        FranchiseesSettings.prototype.initValues = function (data) {
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
        };
        FranchiseesSettings.prototype.deleteUserByFranchisee = function (value) {
            var _this = this;
            userService.unassignUser(value.id).then(function () {
                _this.getUsersByFranchiseeId();
            });
        };
        FranchiseesSettings.prototype.deleteVehicleByFranchisee = function (value) {
            var _this = this;
            vehiclesService.unassignVehicle(value.id).then(function () {
                _this.getVehiclesByFranchiseeId();
            });
        };
        FranchiseesSettings.prototype.getFranchisees = function (id) {
            if (id) {
                return franchiseesService.loadFranchisee(id);
            }
            return $.Deferred().reject();
        };
        FranchiseesSettings.prototype.addUser = function () {
            var _this = this;
            var viewModel = new userViewModel(true);
            viewModel.franchiseeID(this.id);
            var dialog = new saveModal('Добавить новую сущность -' + this.userEntityName, viewModel);
            dialog.show().then(function (status, entity) {
                if (status === 'save') {
                    var unwrapped = ko.toJS(entity);
                    new users().addUser(unwrapped).then(function () {
                        _this.getUsersByFranchiseeId();
                    });
                }
            });
        };
        FranchiseesSettings.prototype.getUsersByFranchiseeId = function () {
            var _this = this;
            userService.load({ franchiseeId: this.id }).then(function (data) {
                _this.users(data.items);
            });
        };
        FranchiseesSettings.prototype.getVehiclesByFranchiseeId = function () {
            var _this = this;
            vehiclesService.load({ franchiseeId: this.id }).then(function (data) {
                _this.mapVehicles(data.items);
                _this.vehicles(data.items);
            });
        };
        FranchiseesSettings.prototype.mapVehicles = function (vehicles) {
            _.forEach(vehicles, function (vehicle) {
                vehicle.status = lodash.find(settings.Settings.commonStatuses, 'value', vehicle.status - 1);
            });
        };
        FranchiseesSettings.prototype.addVehicle = function () {
            var _this = this;
            var viewModel = new vehicleViewModel(true);
            viewModel.franchiseeID(this.id);
            var dialog = new saveModal('Добавить новую сущность - ' + this.userEntityName, viewModel);
            dialog.show().then(function (status, entity) {
                if (status === 'save') {
                    var unwrapped = ko.toJS(entity);
                    new vehicles().addVehicle(unwrapped).then(function () {
                        _this.getVehiclesByFranchiseeId();
                    });
                }
            });
        };
        FranchiseesSettings.prototype.addCategory = function (value) {
            var _this = this;
            var viewModel = new categoryViewModel(true);
            viewModel.franchiseeId(this.id);
            var dialog = new saveModal('Добавить новую сущность - ' + 'категория', viewModel);
            dialog.show().then(function (status, entity) {
                if (status === 'save') {
                    var unwrapped = ko.toJS(entity);
                    var mapped = {
                        code: unwrapped.code,
                        name: unwrapped.name,
                        franchiseeId: unwrapped.franchiseeId
                    };
                    productService.addCategory(mapped).then(function () {
                        _this.getCategoriesByFranchiseeId();
                    });
                }
            });
        };
        FranchiseesSettings.prototype.updateCategory = function (value) {
            var _this = this;
            var viewModel = new categoryViewModel(true);
            viewModel.franchiseeId(this.id);
            viewModel.setProperties(value);
            var dialog = new saveModal('Обновить сущность - ' + 'категория', viewModel);
            dialog.show().then(function (status, entity) {
                if (status === 'save') {
                    var unwrapped = ko.toJS(entity);
                    var mapped = {
                        id: unwrapped.id,
                        code: unwrapped.code,
                        name: unwrapped.name,
                        franchiseeId: unwrapped.franchiseeId
                    };
                    productService.updateCategory(mapped).then(function () {
                        _this.getCategoriesByFranchiseeId();
                    });
                }
            });
        };
        FranchiseesSettings.prototype.getCategoriesByFranchiseeId = function () {
            var _this = this;
            productService.getCategories(true, this.id).then(function (data) {
                _this.categories(data);
            });
        };
        FranchiseesSettings.prototype.switchDetails = function () {
            var context = this;
            context.detailsOpened(!context.detailsOpened());
        };
        FranchiseesSettings.prototype.save = function () {
            var config = this.createConfig();
            if (this.isUpdateMode) {
                franchiseesService.updateFranchisee(this.id, config).then(function () {
                    app.showMessage('Запись успешно обновлена!');
                });
            }
            else {
                franchiseesService.addFranchisee(config);
            }
        };
        FranchiseesSettings.prototype.isValidTaxtaions = function () {
            var value = true;
            var properties = ['name', 'value'];
            _.forEach(this.taxations(), function (taxation) {
                var rowForValidation = _.pick(taxation, properties);
                if (taxation.isUsed() === true && value) {
                    value = !_.some(rowForValidation, function (value) {
                        var property = ko.unwrap(value);
                        return lodash.isNil(property) || (property === "");
                    });
                }
            });
            return value;
        };
        FranchiseesSettings.prototype.createConfig = function () {
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
            };
        };
        FranchiseesSettings.prototype.removeFranchisee = function (user) {
            return franchiseesService.deleteFranchisee(user);
        };
        FranchiseesSettings.prototype.activate = function (id) {
            this.isUpdateMode = (id) ? true : false;
            if (this.isUpdateMode) {
                this.headerName = 'Редактировать Франшизу';
            }
            else {
                this.headerName = 'Добавить Франшизу';
            }
            this.initialize(id);
        };
        return FranchiseesSettings;
    }());
    FranchiseesSettings.VALIDATION_INCLUDED = ['legalName', 'abn', 'tfn', 'password', 'ownerFirstName', 'ownerSurname',
        'ownerEmailAddress', ' address', 'suburb', 'country', 'state', 'postCode', 'phoneNumber'];
    return FranchiseesSettings;
});
//# sourceMappingURL=franchiseesSettings.js.map