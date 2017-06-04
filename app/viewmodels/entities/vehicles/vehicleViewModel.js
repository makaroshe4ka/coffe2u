define(["require", "exports", "knockout", "../../../services/franchiseesService", "lodash", "../../../common/settings"], function (require, exports, ko, franchiseesService, lodash, settings) {
    "use strict";
    var VehicleViewModel = (function () {
        function VehicleViewModel(addFranchiseeMode) {
            if (addFranchiseeMode === void 0) { addFranchiseeMode = false; }
            this.id = ko.observable();
            this.vehicleCode = ko.observable().extend({ limitLength: 25 });
            this.licensePlate = ko.observable().extend({ limitLength: 25 });
            this.assigned = ko.observable();
            this.franchiseeName = ko.observable();
            this.status = ko.observable();
            this.selectedStatus = ko.observable();
            this.allStatuses = ko.observableArray(settings.Settings.commonStatuses);
            this.franchisees = ko.observableArray();
            this.selectedFranchisee = ko.observable();
            this.franchiseeID = ko.observable();
            this.addFranchiseeMode = addFranchiseeMode;
        }
        VehicleViewModel.prototype.initialize = function () {
            var _this = this;
            franchiseesService.load().then(function (data) {
                _this.franchisees(data);
                _this.setSelectedFranchisee();
            });
        };
        VehicleViewModel.prototype.setSelectedFranchisee = function () {
            var _this = this;
            var selected = lodash.find(this.franchisees(), function (value) {
                return value.id === _this.franchiseeID();
            });
            this.selectedFranchisee(selected);
        };
        VehicleViewModel.prototype.setProperties = function (entity) {
            var vm = this;
            vm.id(entity.id);
            vm.status(entity.status);
            vm.vehicleCode(entity.vehicleCode);
            vm.licensePlate(entity.licensePlate);
            vm.assigned(entity.emailAddress);
            vm.franchiseeName(entity.franchiseeName);
            vm.franchiseeID(entity.franchiseeID);
        };
        VehicleViewModel.prototype.isValidModel = function () {
            var rowForValidation = _.pick(this, VehicleViewModel.VALIDATION_INCLUDED);
            var value = !_.some(rowForValidation, function (value) {
                var property = ko.unwrap(value);
                var isValid = lodash.isFunction(value.isValid) ? !value.isValid() : false;
                return lodash.isNil(property) || (property === "") || isValid;
            });
            return value;
        };
        VehicleViewModel.prototype.activate = function () {
            this.initialize();
        };
        return VehicleViewModel;
    }());
    VehicleViewModel.VALIDATION_INCLUDED = ['vehicleCode', 'licensePlate'];
    return VehicleViewModel;
});
//# sourceMappingURL=vehicleViewModel.js.map